import { prisma } from '../../../lib/prisma';
import { requireApprovedSession } from '../../../lib/apiAuth';
import { catalogErrorResponse } from '../../../lib/catalogErrors';
import { Role } from '../../../src/core/domain/entities/User';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export async function GET(request: NextRequest) {
    try {
        const { error } = await requireApprovedSession([Role.ADMINISTRADOR]);
        if (error) return error;

        const templates = await prisma.template.findMany({
            orderBy: { name: "asc" },
            select: {
                id: true,
                name: true,
                description: true,
                postgraduateId: true,
                postgraduate: {
                    select: { title: true, level: true },
                },
                indicators: {
                    select: { indicatorId: true },
                },
                _count: {
                    select: { indicators: true },
                },
            },
        });

        return NextResponse.json(templates);

    } catch (error: any) {
        console.error("Error at fetching templates:", error);
        return NextResponse.json({
            error: "Error interno del servidor",
            details: error.message,
        }, { status: 500 });
    }
}

const CreateTemplateSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional().nullable(),
    postgraduateId: z.number().int(),
    indicatorIds: z.array(z.number().int()).min(1, "La plantilla debe incluir al menos un indicador"),
});

export async function POST(request: NextRequest) {
    try {
        const { error } = await requireApprovedSession([Role.ADMINISTRADOR]);
        if (error) return error;

        const body = CreateTemplateSchema.parse(await request.json());
        const indicatorIds = [...new Set(body.indicatorIds)];

        const postgraduate = await prisma.postgraduate.findUnique({ where: { id: body.postgraduateId }, select: { id: true } });
        if (!postgraduate) {
            return NextResponse.json({ message: "El posgrado a asociar no existe" }, { status: 404 });
        }

        const existingIndicators = await prisma.indicator.count({ where: { id: { in: indicatorIds } } });
        if (existingIndicators !== indicatorIds.length) {
            return NextResponse.json({ message: "Algunos indicadores no existen" }, { status: 400 });
        }

        const template = await prisma.template.create({
            data: {
                name: body.name,
                description: body.description ?? null,
                postgraduateId: body.postgraduateId,
                indicators: {
                    create: indicatorIds.map((indicatorId) => ({ indicatorId })),
                },
            },
            include: { _count: { select: { indicators: true } } },
        });

        return NextResponse.json(template, { status: 201 });

    } catch (error: any) {
        const mapped = catalogErrorResponse(error);
        if (mapped) return mapped;

        console.error("Error at creating template:", error);
        return NextResponse.json({
            error: "Error interno del servidor",
            details: error.message,
        }, { status: 500 });
    }
}
