import { prisma } from '../../../../../lib/prisma';
import { requireApprovedSession } from '../../../../../lib/apiAuth';
import { catalogErrorResponse } from '../../../../../lib/catalogErrors';
import { Role } from '../../../../../src/core/domain/entities/User';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const SetPostgraduatesSchema = z.object({
    postgraduateIds: z.array(z.number().int()),
});

// Reemplaza el conjunto de posgrados a los que pertenece un usuario.
export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const userId = Number(id);

    try {
        const { error } = await requireApprovedSession([Role.ADMINISTRADOR]);
        if (error) return error;

        if (!Number.isInteger(userId)) {
            return NextResponse.json({ message: "Invalid user id" }, { status: 400 });
        }

        const body = SetPostgraduatesSchema.parse(await request.json());
        const postgraduateIds = [...new Set(body.postgraduateIds)];

        const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const existing = await prisma.postgraduate.count({ where: { id: { in: postgraduateIds } } });
        if (existing !== postgraduateIds.length) {
            return NextResponse.json({ message: "Algunos posgrados no existen" }, { status: 400 });
        }

        await prisma.$transaction([
            prisma.userPostgraduate.deleteMany({ where: { userId } }),
            prisma.userPostgraduate.createMany({
                data: postgraduateIds.map((postgraduateId) => ({ userId, postgraduateId })),
            }),
        ]);

        const updated = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                postgraduates: {
                    select: { postgraduate: { select: { id: true, title: true } } },
                },
            },
        });

        return NextResponse.json(updated);

    } catch (error: any) {
        const mapped = catalogErrorResponse(error);
        if (mapped) return mapped;

        console.error("Error at setting user postgraduates:", error);
        return NextResponse.json({
            error: "Error interno del servidor",
            details: error.message,
        }, { status: 500 });
    }
}
