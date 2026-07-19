import { prisma } from '../../../../lib/prisma';
import { requireApprovedSession } from '../../../../lib/apiAuth';
import { catalogErrorResponse } from '../../../../lib/catalogErrors';
import { Role } from '../../../../src/core/domain/entities/User';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const UpdateTemplateSchema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional().nullable(),
    postgraduateId: z.number().int().optional(),
    indicatorIds: z.array(z.number().int()).min(1).optional(),
});

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const templateId = Number(id);

    try {
        const { error } = await requireApprovedSession([Role.ADMINISTRADOR]);
        if (error) return error;

        if (!Number.isInteger(templateId)) {
            return NextResponse.json({ message: "Invalid id" }, { status: 400 });
        }

        const body = UpdateTemplateSchema.parse(await request.json());

        if (body.postgraduateId !== undefined) {
            const postgraduate = await prisma.postgraduate.findUnique({ where: { id: body.postgraduateId }, select: { id: true } });
            if (!postgraduate) {
                return NextResponse.json({ message: "El posgrado a asociar no existe" }, { status: 404 });
            }
        }

        const indicatorIds = body.indicatorIds ? [...new Set(body.indicatorIds)] : undefined;
        if (indicatorIds) {
            const existingIndicators = await prisma.indicator.count({ where: { id: { in: indicatorIds } } });
            if (existingIndicators !== indicatorIds.length) {
                return NextResponse.json({ message: "Algunos indicadores no existen" }, { status: 400 });
            }
        }

        const operations: any[] = [
            prisma.template.update({
                where: { id: templateId },
                data: {
                    ...(body.name !== undefined && { name: body.name }),
                    ...(body.description !== undefined && { description: body.description }),
                    ...(body.postgraduateId !== undefined && { postgraduateId: body.postgraduateId }),
                },
            }),
        ];

        if (indicatorIds) {
            operations.push(
                prisma.templateIndicator.deleteMany({ where: { templateId } }),
                prisma.templateIndicator.createMany({
                    data: indicatorIds.map((indicatorId) => ({ templateId, indicatorId })),
                }),
            );
        }

        await prisma.$transaction(operations);

        const template = await prisma.template.findUnique({
            where: { id: templateId },
            include: { _count: { select: { indicators: true } } },
        });

        return NextResponse.json(template);

    } catch (error: any) {
        const mapped = catalogErrorResponse(error);
        if (mapped) return mapped;

        console.error("Error at updating template:", error);
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
    const templateId = Number(id);

    try {
        const { error } = await requireApprovedSession([Role.ADMINISTRADOR]);
        if (error) return error;

        if (!Number.isInteger(templateId)) {
            return NextResponse.json({ message: "Invalid id" }, { status: 400 });
        }

        await prisma.$transaction([
            prisma.templateIndicator.deleteMany({ where: { templateId } }),
            prisma.template.delete({ where: { id: templateId } }),
        ]);

        return NextResponse.json({ ok: true });

    } catch (error: any) {
        const mapped = catalogErrorResponse(error);
        if (mapped) return mapped;

        console.error("Error at deleting template:", error);
        return NextResponse.json({
            error: "Error interno del servidor",
            details: error.message,
        }, { status: 500 });
    }
}
