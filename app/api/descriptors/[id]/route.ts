import { prisma } from '../../../../lib/prisma';
import { requireApprovedSession } from '../../../../lib/apiAuth';
import { catalogErrorResponse } from '../../../../lib/catalogErrors';
import { Role } from '../../../../src/core/domain/entities/User';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Solo se editan titulo y descripcion: la ponderacion (1-3) es fija para
// preservar la regla de 3 descriptores con valores unicos (RF-DES-015).
const UpdateDescriptorSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
});

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const descriptorId = Number(id);

    try {
        const { error } = await requireApprovedSession([Role.ADMINISTRADOR]);
        if (error) return error;

        if (!Number.isInteger(descriptorId)) {
            return NextResponse.json({ message: "Invalid id" }, { status: 400 });
        }

        const body = UpdateDescriptorSchema.parse(await request.json());

        const descriptor = await prisma.descriptor.update({
            where: { id: descriptorId },
            data: body,
        });

        return NextResponse.json(descriptor);

    } catch (error: any) {
        const mapped = catalogErrorResponse(error);
        if (mapped) return mapped;

        console.error("Error at updating descriptor:", error);
        return NextResponse.json({
            error: "Error interno del servidor",
            details: error.message,
        }, { status: 500 });
    }
}
