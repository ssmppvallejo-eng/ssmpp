import { prisma } from "../../../../lib/prisma";
import { requireApprovedSession } from "../../../../lib/apiAuth";
import { NextRequest, NextResponse } from "next/server";
import { Role } from "../../../../src/core/domain/entities/User";

// Descarga una evidencia. Pueden verla: administradores y coordinadores, y
// cualquier usuario asignado a la evaluacion a la que pertenece el archivo.
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const evidenceId = Number(id);

    try {
        const { session, error } = await requireApprovedSession();
        if (error) return error;

        if (!Number.isInteger(evidenceId)) {
            return NextResponse.json({ message: "Invalid id" }, { status: 400 });
        }

        const isSupervisor = session.user.role === Role.ADMINISTRADOR || session.user.role === Role.COORDINADOR;

        if (!isSupervisor) {
            const response = await prisma.assignmentIndicatorDescriptor.findFirst({
                where: { evidenceUrl: `/api/evidence/${evidenceId}` },
                select: { assignmentIndicator: { select: { assignmentId: true } } },
            });

            const membership = response
                ? await prisma.userAssignTo.findUnique({
                    where: {
                        assignmentId_userId: {
                            assignmentId: response.assignmentIndicator.assignmentId,
                            userId: session.user.id,
                        },
                    },
                })
                : null;

            if (!membership) {
                return NextResponse.json({ message: "Forbidden" }, { status: 403 });
            }
        }

        const evidence = await prisma.evidenceFile.findUnique({ where: { id: evidenceId } });
        if (!evidence) {
            return NextResponse.json({ message: "Evidence not found" }, { status: 404 });
        }

        return new NextResponse(new Uint8Array(evidence.data), {
            headers: {
                "Content-Type": evidence.mimeType,
                "Content-Disposition": `inline; filename="${encodeURIComponent(evidence.filename)}"`,
                "Cache-Control": "private, max-age=3600",
            },
        });

    } catch (error: any) {
        console.error("Error at fetching evidence:", error);
        return NextResponse.json({
            error: "Error interno del servidor",
            details: error.message,
        }, { status: 500 });
    }
}
