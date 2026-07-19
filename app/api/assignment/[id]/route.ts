import { requireApprovedSession } from '../../../../lib/apiAuth';
import { NextRequest, NextResponse } from 'next/server';
import { SaveAssignmentResponseSchema } from '../../../../src/core/application/dtos/AssignmentDTO';
import { z } from 'zod';
import { Role } from '../../../../src/core/domain/entities/User';
import { PrismaAssignmentRepository } from '../../../../src/infrastructure/persistence/PrismaAssignmentRepository';
import { PrismaUserRepository } from '../../../../src/infrastructure/persistence/PrismaUserRepository';
import { SaveStudentResponseUseCase } from '../../../../src/core/application/use-cases/SaveStudentResponse';
import { GetAssignmentByIdUseCase } from '../../../../src/core/application/use-cases/GetAssignmentById';
import { UpdateAssignmentUseCase } from '../../../../src/core/application/use-cases/UpdateAssignment';
import { DeleteAssignmentUseCase } from '../../../../src/core/application/use-cases/DeleteAssignment';

// Instantiate dependencies once per request cycle
const repository = new PrismaAssignmentRepository();
const userRepository = new PrismaUserRepository();
const getAssignmentUseCase = new GetAssignmentByIdUseCase(repository);
const saveResponseUseCase = new SaveStudentResponseUseCase(repository);
const updateAssignmentUseCase = new UpdateAssignmentUseCase(repository, userRepository);
const deleteAssignmentUseCase = new DeleteAssignmentUseCase(repository);

const UpdateAssignmentSchema = z.object({
    dueDate: z.coerce.date().optional(),
    userIds: z.array(z.number().int()).min(1).optional(),
}).refine(
    (data) => data.dueDate !== undefined || data.userIds !== undefined,
    { message: "Debe incluir dueDate o userIds" }
);

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const assignmentId = Number(id);

    try {
        const { session, error } = await requireApprovedSession();
        if (error) return error;

        const assignment = await getAssignmentUseCase.execute(session.user.id, assignmentId);
        return NextResponse.json(assignment);

    } catch (error: any) {
        if (error.message.includes('FORBIDDEN')) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }
        if (error.message.includes('NOT_FOUND')) {
            return NextResponse.json({ message: "Assignment not found" }, { status: 404 });
        }

        console.error("Error at fetching assignments:", error);
        return NextResponse.json({
            error: "Error interno del servidor",
            details: error.message,
        }, { status: 500 });
    }
}

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const assignmentId = Number(id);

    try {
        // La pertenencia (UserAssignTo) se valida en el caso de uso; cualquier
        // usuario asignado a la actividad puede responderla.
        const { session, error } = await requireApprovedSession();
        if (error) return error;

        const json = await request.json();
        const body = SaveAssignmentResponseSchema.parse(json);

        const result = await saveResponseUseCase.execute(session.user.id, assignmentId, body);
        return NextResponse.json(result);

    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({
                error: "Error de validación",
                details: (error as any).errors || error.issues
            }, { status: 400 });
        }
        if (error.message.includes('FORBIDDEN')) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }
        if (error.message.includes('VALIDATION')) {
            return NextResponse.json({ message: error.message }, { status: 409 });
        }

        console.error("Error at posting assignments:", error);
        return NextResponse.json({
            error: "Error interno del servidor",
            details: error.message
        }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const assignmentId = Number(id);

    try {
        const { error } = await requireApprovedSession([Role.ADMINISTRADOR]);
        if (error) return error;

        if (!Number.isInteger(assignmentId)) {
            return NextResponse.json({ message: "Invalid assignment id" }, { status: 400 });
        }

        const body = UpdateAssignmentSchema.parse(await request.json());

        const assignment = await updateAssignmentUseCase.execute(assignmentId, body);
        return NextResponse.json(assignment);

    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Error de validación", details: error.issues }, { status: 400 });
        }
        if (error.message.includes('NOT_FOUND')) {
            return NextResponse.json({ message: "Assignment not found" }, { status: 404 });
        }
        if (error.message.includes('VALIDATION')) {
            return NextResponse.json({ message: error.message }, { status: 400 });
        }

        console.error("Error at updating assignment:", error);
        return NextResponse.json({
            error: "Error interno del servidor",
            details: error.message
        }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const assignmentId = Number(id);

    try {
        const { error } = await requireApprovedSession([Role.ADMINISTRADOR]);
        if (error) return error;

        if (!Number.isInteger(assignmentId)) {
            return NextResponse.json({ message: "Invalid assignment id" }, { status: 400 });
        }

        await deleteAssignmentUseCase.execute(assignmentId);
        return NextResponse.json({ ok: true });

    } catch (error: any) {
        if (error.message.includes('NOT_FOUND')) {
            return NextResponse.json({ message: "Assignment not found" }, { status: 404 });
        }

        console.error("Error at deleting assignment:", error);
        return NextResponse.json({
            error: "Error interno del servidor",
            details: error.message
        }, { status: 500 });
    }
}
