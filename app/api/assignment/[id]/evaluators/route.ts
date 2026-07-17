import { requireApprovedSession } from "../../../../../lib/apiAuth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Role } from "../../../../../src/core/domain/entities/User";
import { AssignEvaluatorSchema } from "../../../../../src/core/application/dtos/AssignmentDTO";
import { AssignEvaluatorUseCase } from "../../../../../src/core/application/use-cases/AssignEvaluator";
import { PrismaAssignmentRepository } from "../../../../../src/infrastructure/persistence/PrismaAssignmentRepository";
import { PrismaUserRepository } from "../../../../../src/infrastructure/persistence/PrismaUserRepository";

const assignmentRepository = new PrismaAssignmentRepository();
const userRepository = new PrismaUserRepository();
const assignEvaluatorUseCase = new AssignEvaluatorUseCase(assignmentRepository, userRepository);

export async function POST(
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

        const json = await request.json();
        const body = AssignEvaluatorSchema.parse(json);

        const result = await assignEvaluatorUseCase.execute(assignmentId, body.userId);
        return NextResponse.json(result);

    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Error de validación", details: error.issues }, { status: 400 });
        }
        if (error.message.includes("NOT_FOUND")) {
            return NextResponse.json({ message: error.message }, { status: 404 });
        }
        if (error.message.includes("VALIDATION")) {
            return NextResponse.json({ message: error.message }, { status: 400 });
        }

        console.error("Error at assigning evaluator:", error);
        return NextResponse.json({
            error: "Error interno del servidor",
            details: error.message,
        }, { status: 500 });
    }
}
