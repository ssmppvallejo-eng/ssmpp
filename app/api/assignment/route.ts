import { requireApprovedSession } from '../../../lib/apiAuth';
import { Role } from '../../../src/core/domain/entities/User';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { CreateAssignmentSchema } from '../../../src/core/application/dtos/AssignmentDTO';
import { CreateAssignmentUseCase } from '../../../src/core/application/use-cases/CreateAssignment';
import { ListAssignmentsUseCase } from '../../../src/core/application/use-cases/ListAssignments';
import { PrismaAssignmentRepository } from '../../../src/infrastructure/persistence/PrismaAssignmentRepository';
import { PrismaUserRepository } from '../../../src/infrastructure/persistence/PrismaUserRepository';

const assignmentRepository = new PrismaAssignmentRepository();
const userRepository = new PrismaUserRepository();
const listAssignmentsUseCase = new ListAssignmentsUseCase(assignmentRepository);
const createAssignmentUseCase = new CreateAssignmentUseCase(assignmentRepository, userRepository);

export async function GET(request: NextRequest) {
    try {
        const { error } = await requireApprovedSession([Role.ADMINISTRADOR]);
        if (error) return error;

        const assignments = await listAssignmentsUseCase.execute();
        return NextResponse.json(assignments);

    } catch (error: any) {
        return NextResponse.json({
            error: "Error interno del servidor",
            details: error.message,
        }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { session, error } = await requireApprovedSession([Role.ADMINISTRADOR]);
        if (error) return error;

        const json = await request.json();
        const body = CreateAssignmentSchema.parse(json);

        const assignment = await createAssignmentUseCase.execute(session.user.id, body);
        return NextResponse.json(assignment, { status: 201 });

    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({
                error: "Error de validación",
                details: error.issues
            }, { status: 400 });
        }
        if (error.message.includes('NOT_FOUND')) {
            return NextResponse.json({ message: error.message }, { status: 404 });
        }
        if (error.message.includes('VALIDATION')) {
            return NextResponse.json({ message: error.message }, { status: 400 });
        }

        console.error("Error at creating assignment:", error);
        return NextResponse.json({
            error: "Error interno del servidor",
            details: error.message,
        }, { status: 500 });
    }
}
