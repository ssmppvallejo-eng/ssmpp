import { prisma } from '../../../../lib/prisma';
import { requireApprovedSession } from '../../../../lib/apiAuth';
import { catalogErrorResponse } from '../../../../lib/catalogErrors';
import { logInstrumentEdit } from '../../../../lib/instrumentLog';
import { Role } from '../../../../src/core/domain/entities/User';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const UpdateJudgementSchema = z.object({
    code: z.string().min(1).optional(),
    title: z.string().min(1).optional(),
    description: z.string().optional().nullable(),
});

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const judgementId = Number(id);

    try {
        const { session, error } = await requireApprovedSession([Role.ADMINISTRADOR]);
        if (error) return error;

        if (!Number.isInteger(judgementId)) {
            return NextResponse.json({ message: "Invalid id" }, { status: 400 });
        }

        const body = UpdateJudgementSchema.parse(await request.json());

        const judgement = await prisma.judgement.update({
            where: { id: judgementId },
            data: body,
        });

        await logInstrumentEdit({
            session, entityType: "JUDGEMENT", entityId: judgement.id, entityCode: judgement.code,
            action: "UPDATE", changes: body,
        });

        return NextResponse.json(judgement);

    } catch (error: any) {
        const mapped = catalogErrorResponse(error);
        if (mapped) return mapped;

        console.error("Error at updating judgement:", error);
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
    const judgementId = Number(id);

    try {
        const { session, error } = await requireApprovedSession([Role.ADMINISTRADOR]);
        if (error) return error;

        if (!Number.isInteger(judgementId)) {
            return NextResponse.json({ message: "Invalid id" }, { status: 400 });
        }

        const existing = await prisma.judgement.findUnique({ where: { id: judgementId }, select: { code: true, title: true } });

        await prisma.judgement.delete({ where: { id: judgementId } });

        await logInstrumentEdit({
            session, entityType: "JUDGEMENT", entityId: judgementId, entityCode: existing?.code,
            action: "DELETE", changes: existing ?? undefined,
        });

        return NextResponse.json({ ok: true });

    } catch (error: any) {
        const mapped = catalogErrorResponse(error);
        if (mapped) return mapped;

        console.error("Error at deleting judgement:", error);
        return NextResponse.json({
            error: "Error interno del servidor",
            details: error.message,
        }, { status: 500 });
    }
}
