import { prisma } from '../../../../lib/prisma';
import { requireApprovedSession } from '../../../../lib/apiAuth';
import { catalogErrorResponse } from '../../../../lib/catalogErrors';
import { Role } from '../../../../src/core/domain/entities/User';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const UpdateDimensionSchema = z.object({
    code: z.string().min(1).optional(),
    title: z.string().min(1).optional(),
    description: z.string().optional().nullable(),
});

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const dimensionId = Number(id);

    try {
        const { error } = await requireApprovedSession([Role.ADMINISTRADOR]);
        if (error) return error;

        if (!Number.isInteger(dimensionId)) {
            return NextResponse.json({ message: "Invalid id" }, { status: 400 });
        }

        const body = UpdateDimensionSchema.parse(await request.json());

        const dimension = await prisma.dimension.update({
            where: { id: dimensionId },
            data: body,
        });

        return NextResponse.json(dimension);

    } catch (error: any) {
        const mapped = catalogErrorResponse(error);
        if (mapped) return mapped;

        console.error("Error at updating dimension:", error);
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
    const dimensionId = Number(id);

    try {
        const { error } = await requireApprovedSession([Role.ADMINISTRADOR]);
        if (error) return error;

        if (!Number.isInteger(dimensionId)) {
            return NextResponse.json({ message: "Invalid id" }, { status: 400 });
        }

        await prisma.dimension.delete({ where: { id: dimensionId } });
        return NextResponse.json({ ok: true });

    } catch (error: any) {
        const mapped = catalogErrorResponse(error);
        if (mapped) return mapped;

        console.error("Error at deleting dimension:", error);
        return NextResponse.json({
            error: "Error interno del servidor",
            details: error.message,
        }, { status: 500 });
    }
}
