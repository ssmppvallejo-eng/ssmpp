import { prisma } from '../../../lib/prisma';
import { requireApprovedSession } from '../../../lib/apiAuth';
import { catalogErrorResponse } from '../../../lib/catalogErrors';
import { logInstrumentEdit } from '../../../lib/instrumentLog';
import { Role } from '../../../src/core/domain/entities/User';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const CreateJudgementSchema = z.object({
    componentId: z.number().int(),
    code: z.string().min(1),
    title: z.string().min(1),
    description: z.string().optional().nullable(),
});

export async function POST(request: NextRequest) {
    try {
        const { session, error } = await requireApprovedSession([Role.ADMINISTRADOR]);
        if (error) return error;

        const body = CreateJudgementSchema.parse(await request.json());

        const component = await prisma.component.findUnique({ where: { id: body.componentId }, select: { id: true } });
        if (!component) {
            return NextResponse.json({ message: "El componente a asociar no existe" }, { status: 404 });
        }

        const judgement = await prisma.judgement.create({
            data: {
                componentId: body.componentId,
                code: body.code,
                title: body.title,
                description: body.description ?? null,
            },
        });

        await logInstrumentEdit({
            session, entityType: "JUDGEMENT", entityId: judgement.id, entityCode: judgement.code,
            action: "CREATE", changes: body,
        });

        return NextResponse.json(judgement, { status: 201 });

    } catch (error: any) {
        const mapped = catalogErrorResponse(error);
        if (mapped) return mapped;

        console.error("Error at creating judgement:", error);
        return NextResponse.json({
            error: "Error interno del servidor",
            details: error.message,
        }, { status: 500 });
    }
}
