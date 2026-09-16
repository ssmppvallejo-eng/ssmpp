import { prisma } from "../../../../../lib/prisma";
import { requireApprovedSession } from "../../../../../lib/apiAuth";
import { NextRequest, NextResponse } from "next/server";
import { PrismaAssignmentRepository } from "../../../../../src/infrastructure/persistence/PrismaAssignmentRepository";

const repository = new PrismaAssignmentRepository();

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB (limite practico del body en serverless)

const ALLOWED_TYPES: Record<string, string> = {
    "application/pdf": "PDF",
    "image/png": "PNG",
    "image/jpeg": "JPG",
    "application/msword": "DOC",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
    "application/vnd.ms-excel": "XLS",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "XLSX",
};

function hasPrefix(bytes: Buffer, prefix: number[]): boolean {
    return prefix.every((value, index) => bytes[index] === value);
}

function matchesDeclaredType(bytes: Buffer, mimeType: string): boolean {
    if (mimeType === "application/pdf") return hasPrefix(bytes, [0x25, 0x50, 0x44, 0x46]);
    if (mimeType === "image/png") return hasPrefix(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    if (mimeType === "image/jpeg") return hasPrefix(bytes, [0xff, 0xd8, 0xff]);

    const isZip = hasPrefix(bytes, [0x50, 0x4b, 0x03, 0x04]);
    const isOle = hasPrefix(bytes, [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]);
    if (mimeType.includes("openxmlformats-officedocument")) return isZip;
    if (mimeType === "application/msword" || mimeType === "application/vnd.ms-excel") return isOle;

    return false;
}

// Adjunta evidencia documental a la respuesta de un indicador (RF-IND-005).
export async function POST(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const assignmentId = Number(id);

    try {
        const { session, error } = await requireApprovedSession();
        if (error) return error;

        if (!Number.isInteger(assignmentId)) {
            return NextResponse.json({ message: "Invalid assignment id" }, { status: 400 });
        }

        const isMember = await repository.verifyOwnership(assignmentId, session.user.id);
        if (!isMember) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const assignment = await repository.getAssignmentStatus(assignmentId);
        if (!assignment || (assignment.status !== "PENDIENTE" && assignment.status !== "EN_PROCESO")) {
            return NextResponse.json({ message: "La actividad ya fue enviada" }, { status: 409 });
        }

        const formData = await request.formData();
        const file = formData.get("file");
        const assignmentIndicatorId = Number(formData.get("assignmentIndicatorId"));

        if (!(file instanceof File) || !Number.isInteger(assignmentIndicatorId)) {
            return NextResponse.json({ message: "Se requiere un archivo y el indicador" }, { status: 400 });
        }
        if (!ALLOWED_TYPES[file.type]) {
            return NextResponse.json({
                message: `Tipo de archivo no permitido. Usa: ${Object.values(ALLOWED_TYPES).join(", ")}`,
            }, { status: 400 });
        }
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ message: "El archivo supera el límite de 5 MB" }, { status: 400 });
        }

        const belongs = await repository.verifyIndicatorInAssignment(assignmentIndicatorId, assignmentId);
        if (!belongs) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const response = await prisma.assignmentIndicatorDescriptor.findFirst({
            where: { assignmentIndicatorId },
            select: { id: true, evidenceUrl: true },
        });
        if (!response) {
            return NextResponse.json({
                message: "Selecciona primero un descriptor para este indicador",
            }, { status: 409 });
        }

        const bytes = Buffer.from(await file.arrayBuffer());
        if (!matchesDeclaredType(bytes, file.type)) {
            return NextResponse.json({
                message: "El contenido del archivo no coincide con el tipo declarado",
            }, { status: 400 });
        }

        const evidence = await prisma.evidenceFile.create({
            data: { filename: file.name, mimeType: file.type, data: bytes },
        });

        await prisma.assignmentIndicatorDescriptor.update({
            where: { id: response.id },
            data: {
                evidenceName: file.name,
                evidenceUrl: `/api/evidence/${evidence.id}`,
                addEvidence: true,
            },
        });

        // Si habia una evidencia anterior, se elimina para no acumular archivos.
        const previousId = response.evidenceUrl?.match(/^\/api\/evidence\/(\d+)$/)?.[1];
        if (previousId) {
            await prisma.evidenceFile.deleteMany({ where: { id: Number(previousId) } });
        }

        return NextResponse.json({
            evidenceName: file.name,
            evidenceUrl: `/api/evidence/${evidence.id}`,
        }, { status: 201 });

    } catch (error: any) {
        console.error("Error at uploading evidence:", error);
        return NextResponse.json({
            error: "Error interno del servidor",
            ...(process.env.NODE_ENV !== "production" && { details: error.message }),
        }, { status: 500 });
    }
}
