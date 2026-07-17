import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireApprovedSession } from '../../../../lib/apiAuth';
import { AccessStatus, Role } from '../../../../src/core/domain/entities/User';
import { UpdateUserAccessUseCase } from '../../../../src/core/application/use-cases/UpdateUserAccess';
import { PrismaUserRepository } from '../../../../src/infrastructure/persistence/PrismaUserRepository';

const repository = new PrismaUserRepository();
const updateUserAccessUseCase = new UpdateUserAccessUseCase(repository);

const UpdateUserSchema = z.object({
    accessStatus: z.enum(AccessStatus).optional(),
    role: z.enum(Role).optional(),
}).refine(
    (data) => data.accessStatus !== undefined || data.role !== undefined,
    { message: "Debe incluir accessStatus o role" }
);

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const targetUserId = Number(id);

    try {
        const { session, error } = await requireApprovedSession([Role.ADMINISTRADOR]);
        if (error) return error;

        if (!Number.isInteger(targetUserId)) {
            return NextResponse.json({ message: "Invalid user id" }, { status: 400 });
        }

        const json = await request.json();
        const body = UpdateUserSchema.parse(json);

        const user = await updateUserAccessUseCase.execute(session.user.id, targetUserId, body);

        return NextResponse.json(user);

    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({
                error: "Error de validación",
                details: error.issues
            }, { status: 400 });
        }
        if (error.message.includes('FORBIDDEN')) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }
        if (error.message.includes('NOT_FOUND')) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        console.error('Error at updating user: ', error);
        return NextResponse.json({
            error: "Error interno del servidor al actualizar usuario",
            details: error.message,
        }, { status: 500 });
    }
}
