import { prisma } from '../../../lib/prisma';
import { requireApprovedSession } from '../../../lib/apiAuth';
import { catalogErrorResponse } from '../../../lib/catalogErrors';
import { Role } from '../../../src/core/domain/entities/User';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// RF-DES-015: cada indicador nace con exactamente 3 descriptores con
// ponderaciones 1, 2 y 3 (No logrado / En proceso / Plenamente logrado).
const CreateIndicatorSchema = z.object({
    judgementId: z.number().int(),
    code: z.string().min(1),
    description: z.string().min(1),
    justification: z.string().optional().nullable(),
    descriptors: z.array(z.object({
        title: z.string().min(1),
        description: z.string().min(1),
    })).length(3, "Un indicador debe tener exactamente 3 descriptores"),
});

export async function POST(request: NextRequest) {
    try {
        const { error } = await requireApprovedSession([Role.ADMINISTRADOR]);
        if (error) return error;

        const body = CreateIndicatorSchema.parse(await request.json());

        const judgement = await prisma.judgement.findUnique({ where: { id: body.judgementId }, select: { id: true } });
        if (!judgement) {
            return NextResponse.json({ message: "El criterio a asociar no existe" }, { status: 404 });
        }

        const indicator = await prisma.indicator.create({
            data: {
                judgementId: body.judgementId,
                code: body.code,
                description: body.description,
                justification: body.justification ?? null,
                descriptors: {
                    create: body.descriptors.map((descriptor, index) => ({
                        title: descriptor.title,
                        description: descriptor.description,
                        value: index + 1,
                    })),
                },
            },
            include: { descriptors: true },
        });

        return NextResponse.json(indicator, { status: 201 });

    } catch (error: any) {
        const mapped = catalogErrorResponse(error);
        if (mapped) return mapped;

        console.error("Error at creating indicator:", error);
        return NextResponse.json({
            error: "Error interno del servidor",
            details: error.message,
        }, { status: 500 });
    }
}
