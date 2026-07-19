import { prisma } from '../../../lib/prisma';
import { requireApprovedSession } from '../../../lib/apiAuth';
import { catalogErrorResponse } from '../../../lib/catalogErrors';
import { logInstrumentEdit } from '../../../lib/instrumentLog';
import { Role } from '../../../src/core/domain/entities/User';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Catalogo jerarquico completo del instrumento:
// dimension -> componentes -> criterios (Judgement) -> indicadores -> descriptores.
export async function GET(request: NextRequest) {
    try {
        const { error } = await requireApprovedSession([Role.ADMINISTRADOR]);
        if (error) return error;

        const dimensions = await prisma.dimension.findMany({
            orderBy: { code: "asc" },
            select: {
                id: true,
                code: true,
                title: true,
                description: true,
                components: {
                    orderBy: { code: "asc" },
                    select: {
                        id: true,
                        code: true,
                        title: true,
                        description: true,
                        judgements: {
                            orderBy: { code: "asc" },
                            select: {
                                id: true,
                                code: true,
                                title: true,
                                description: true,
                                indicators: {
                                    orderBy: { code: "asc" },
                                    select: {
                                        id: true,
                                        code: true,
                                        description: true,
                                        justification: true,
                                        requiresComment: true,
                                        requiresEvidence: true,
                                        descriptors: {
                                            orderBy: { value: "asc" },
                                            select: {
                                                id: true,
                                                title: true,
                                                description: true,
                                                value: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        return NextResponse.json(dimensions);

    } catch (error: any) {
        console.error("Error at fetching dimensions:", error);
        return NextResponse.json({
            error: "Error interno del servidor",
            details: error.message,
        }, { status: 500 });
    }
}

const CreateDimensionSchema = z.object({
    code: z.string().min(1),
    title: z.string().min(1),
    description: z.string().optional().nullable(),
});

export async function POST(request: NextRequest) {
    try {
        const { session, error } = await requireApprovedSession([Role.ADMINISTRADOR]);
        if (error) return error;

        const body = CreateDimensionSchema.parse(await request.json());

        const dimension = await prisma.dimension.create({
            data: {
                code: body.code,
                title: body.title,
                description: body.description ?? null,
            },
        });

        await logInstrumentEdit({
            session, entityType: "DIMENSION", entityId: dimension.id, entityCode: dimension.code,
            action: "CREATE", changes: body,
        });

        return NextResponse.json(dimension, { status: 201 });

    } catch (error: any) {
        const mapped = catalogErrorResponse(error);
        if (mapped) return mapped;

        console.error("Error at creating dimension:", error);
        return NextResponse.json({
            error: "Error interno del servidor",
            details: error.message,
        }, { status: 500 });
    }
}
