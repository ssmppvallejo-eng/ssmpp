import { prisma } from '../../../lib/prisma';
import { requireApprovedSession } from '../../../lib/apiAuth';
import { Role } from '../../../src/core/domain/entities/User';
import { NextRequest, NextResponse } from 'next/server';

// Catalogo jerarquico para el formulario de creacion de asignaciones:
// dimension -> componentes -> criterios (Judgement) -> indicadores.
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
                        judgements: {
                            orderBy: { code: "asc" },
                            select: {
                                id: true,
                                code: true,
                                title: true,
                                indicators: {
                                    orderBy: { code: "asc" },
                                    select: {
                                        id: true,
                                        code: true,
                                        description: true,
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
