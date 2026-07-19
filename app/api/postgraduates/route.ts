import { prisma } from '../../../lib/prisma';
import { requireApprovedSession } from '../../../lib/apiAuth';
import { catalogErrorResponse } from '../../../lib/catalogErrors';
import { Role } from '../../../src/core/domain/entities/User';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { AREAS, LEVELS } from '../../../src/core/domain/entities/Postgraduate';

const CreatePostgraduateSchema = z.object({
    title: z.string().min(1),
    level: z.enum(LEVELS),
    knowledgeArea: z.enum(AREAS),
});

export async function GET(request: NextRequest) {
    try {
        const { error } = await requireApprovedSession([Role.ADMINISTRADOR]);
        if (error) return error;

        const postgraduates = await prisma.postgraduate.findMany({
            orderBy: { title: "asc" },
            include: {
                _count: {
                    select: { templates: true, users: true },
                },
            },
        });

        return NextResponse.json(postgraduates);

    } catch (error: any) {
        console.error("Error at fetching postgraduates:", error);
        return NextResponse.json({
            error: "Error interno del servidor",
            details: error.message,
        }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { error } = await requireApprovedSession([Role.ADMINISTRADOR]);
        if (error) return error;

        const body = CreatePostgraduateSchema.parse(await request.json());

        const postgraduate = await prisma.postgraduate.create({ data: body });
        return NextResponse.json(postgraduate, { status: 201 });

    } catch (error: any) {
        const mapped = catalogErrorResponse(error);
        if (mapped) return mapped;

        console.error("Error at creating postgraduate:", error);
        return NextResponse.json({
            error: "Error interno del servidor",
            details: error.message,
        }, { status: 500 });
    }
}
