import { requireApprovedSession } from '../../../../lib/apiAuth';
import { NextRequest, NextResponse } from 'next/server';
import { SaveAssignmentResponseSchema } from '../../../../src/core/application/dtos/AssignmentDTO';
import { z } from 'zod';
import { PrismaAssignmentRepository } from '../../../../src/infrastructure/persistence/PrismaAssignmentRepository';
import { SaveStudentResponseUseCase } from '../../../../src/core/application/use-cases/SaveStudentResponse';
import { GetAssignmentByIdUseCase } from '../../../../src/core/application/use-cases/GetAssignmentById';

// Instantiate dependencies once per request cycle
const repository = new PrismaAssignmentRepository();
const getAssignmentUseCase = new GetAssignmentByIdUseCase(repository);
const saveResponseUseCase = new SaveStudentResponseUseCase(repository);

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

        console.error("Error at posting assignments:", error);
        return NextResponse.json({
            error: "Error interno del servidor",
            details: error.message
        }, { status: 500 });
    }
}
