import { prisma } from '../../../../lib/prisma';
import { requireApprovedSession } from '../../../../lib/apiAuth';
import { Role } from '../../../../src/core/domain/entities/User';
import { NextRequest, NextResponse } from 'next/server';

const PAGE_SIZE = 50;

// Bitacora de cambios al instrumento (RF-DIM/COM/CRI/IND/DES, Should del SRS).
export async function GET(request: NextRequest) {
    try {
        const { error } = await requireApprovedSession([Role.ADMINISTRADOR]);
        if (error) return error;

        const { searchParams } = new URL(request.url);
        const entityType = searchParams.get("entityType");
        const action = searchParams.get("action");
        const page = Math.max(1, Number(searchParams.get("page")) || 1);

        const where = {
            ...(entityType && { entityType: entityType as any }),
            ...(action && { action: action as any }),
        };

        const [entries, total] = await Promise.all([
            prisma.instrumentEditLog.findMany({
                where,
                orderBy: { createdAt: "desc" },
                skip: (page - 1) * PAGE_SIZE,
                take: PAGE_SIZE,
            }),
            prisma.instrumentEditLog.count({ where }),
        ]);

        return NextResponse.json({
            entries,
            total,
            page,
            pageSize: PAGE_SIZE,
            totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
        });

    } catch (error: any) {
        console.error("Error at fetching instrument history:", error);
        return NextResponse.json({
            error: "Error interno del servidor",
            details: error.message,
        }, { status: 500 });
    }
}
