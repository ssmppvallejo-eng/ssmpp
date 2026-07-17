import { prisma } from '../../../../lib/prisma';
import { requireApprovedSession } from '../../../../lib/apiAuth';
import { catalogErrorResponse } from '../../../../lib/catalogErrors';
import { Role } from '../../../../src/core/domain/entities/User';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { AREAS, LEVELS } from '../../../../src/core/domain/entities/Postgraduate';

const UpdatePostgraduateSchema = z.object({
    title: z.string().min(1).optional(),
    level: z.enum(LEVELS).optional(),
    knowledgeArea: z.enum(AREAS).optional(),
});

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const postgraduateId = Number(id);

    try {
        const { error } = await requireApprovedSession([Role.ADMINISTRADOR]);
        if (error) return error;

        if (!Number.isInteger(postgraduateId)) {
            return NextResponse.json({ message: "Invalid id" }, { status: 400 });
        }

        const body = UpdatePostgraduateSchema.parse(await request.json());

        const postgraduate = await prisma.postgraduate.update({
            where: { id: postgraduateId },
            data: body,
        });

        return NextResponse.json(postgraduate);

    } catch (error: any) {
        const mapped = catalogErrorResponse(error);
        if (mapped) return mapped;

        console.error("Error at updating postgraduate:", error);
        return NextResponse.json({
            error: "Error interno del servidor",
            details: error.message,
        }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const postgraduateId = Number(id);

    try {
        const { error } = await requireApprovedSession([Role.ADMINISTRADOR]);
        if (error) return error;

        if (!Number.isInteger(postgraduateId)) {
            return NextResponse.json({ message: "Invalid id" }, { status: 400 });
        }

        // Los vinculos con usuarios se eliminan junto con el posgrado; si tiene
        // plantillas asociadas, la transaccion falla (P2003) y se responde 409.
        await prisma.$transaction([
            prisma.userPostgraduate.deleteMany({ where: { postgraduateId } }),
            prisma.postgraduate.delete({ where: { id: postgraduateId } }),
        ]);

        return NextResponse.json({ ok: true });

    } catch (error: any) {
        const mapped = catalogErrorResponse(error);
        if (mapped) return mapped;

        console.error("Error at deleting postgraduate:", error);
        return NextResponse.json({
            error: "Error interno del servidor",
            details: error.message,
        }, { status: 500 });
    }
}
