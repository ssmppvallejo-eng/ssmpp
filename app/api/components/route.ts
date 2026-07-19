import { prisma } from '../../../lib/prisma';
import { requireApprovedSession } from '../../../lib/apiAuth';
import { catalogErrorResponse } from '../../../lib/catalogErrors';
import { logInstrumentEdit } from '../../../lib/instrumentLog';
import { Role } from '../../../src/core/domain/entities/User';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const CreateComponentSchema = z.object({
    dimensionId: z.number().int(),
    code: z.string().min(1),
    title: z.string().min(1),
    description: z.string().optional().nullable(),
});

export async function POST(request: NextRequest) {
    try {
        const { session, error } = await requireApprovedSession([Role.ADMINISTRADOR]);
        if (error) return error;

        const body = CreateComponentSchema.parse(await request.json());

        const dimension = await prisma.dimension.findUnique({ where: { id: body.dimensionId }, select: { id: true } });
        if (!dimension) {
            return NextResponse.json({ message: "La dimensión a asociar no existe" }, { status: 404 });
        }

        const component = await prisma.component.create({
            data: {
                dimensionId: body.dimensionId,
                code: body.code,
                title: body.title,
                description: body.description ?? null,
            },
        });

        await logInstrumentEdit({
            session, entityType: "COMPONENT", entityId: component.id, entityCode: component.code,
            action: "CREATE", changes: body,
        });

        return NextResponse.json(component, { status: 201 });

    } catch (error: any) {
        const mapped = catalogErrorResponse(error);
        if (mapped) return mapped;

        console.error("Error at creating component:", error);
        return NextResponse.json({
            error: "Error interno del servidor",
            details: error.message,
        }, { status: 500 });
    }
}
