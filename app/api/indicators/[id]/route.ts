import { prisma } from '../../../../lib/prisma';
import { requireApprovedSession } from '../../../../lib/apiAuth';
import { catalogErrorResponse } from '../../../../lib/catalogErrors';
import { Role } from '../../../../src/core/domain/entities/User';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const UpdateIndicatorSchema = z.object({
    code: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    justification: z.string().optional().nullable(),
});

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const indicatorId = Number(id);

    try {
        const { error } = await requireApprovedSession([Role.ADMINISTRADOR]);
        if (error) return error;

        if (!Number.isInteger(indicatorId)) {
            return NextResponse.json({ message: "Invalid id" }, { status: 400 });
        }

        const body = UpdateIndicatorSchema.parse(await request.json());

        const indicator = await prisma.indicator.update({
            where: { id: indicatorId },
            data: body,
        });

        return NextResponse.json(indicator);

    } catch (error: any) {
        const mapped = catalogErrorResponse(error);
        if (mapped) return mapped;

        console.error("Error at updating indicator:", error);
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
    const indicatorId = Number(id);

    try {
        const { error } = await requireApprovedSession([Role.ADMINISTRADOR]);
        if (error) return error;

        if (!Number.isInteger(indicatorId)) {
            return NextResponse.json({ message: "Invalid id" }, { status: 400 });
        }

        // Los descriptores se eliminan junto con el indicador; si alguno esta
        // referido por respuestas de asignaciones, la transaccion falla (P2003).
        await prisma.$transaction([
            prisma.descriptor.deleteMany({ where: { indicatorId } }),
            prisma.indicator.delete({ where: { id: indicatorId } }),
        ]);

        return NextResponse.json({ ok: true });

    } catch (error: any) {
        const mapped = catalogErrorResponse(error);
        if (mapped) return mapped;

        console.error("Error at deleting indicator:", error);
        return NextResponse.json({
            error: "Error interno del servidor",
            details: error.message,
        }, { status: 500 });
    }
}
