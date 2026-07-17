import { requireApprovedSession } from "../../../../../lib/apiAuth";
import { NextRequest, NextResponse } from "next/server";
import { Role } from "../../../../../src/core/domain/entities/User";
import { SubmitStudentAssignmentUseCase } from "../../../../../src/core/application/use-cases/SubmitStudentAssignment";
import { PrismaAssignmentRepository } from "../../../../../src/infrastructure/persistence/PrismaAssignmentRepository";

const repository = new PrismaAssignmentRepository();
const submitAssignmentUseCase = new SubmitStudentAssignmentUseCase(repository);

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const assignmentId = Number(id);

    try {
        const { session, error } = await requireApprovedSession([Role.ESTUDIANTE]);
        if (error) return error;

        const result = await submitAssignmentUseCase.execute(session.user.id, assignmentId);
        return NextResponse.json(result);
    } catch (error: any) {
        if (error.message.includes("FORBIDDEN")) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        if (error.message.includes("INCOMPLETE")) {
            return NextResponse.json({
                message: "Assignment has unanswered indicators",
            }, { status: 409 });
        }

        console.error("Error at submitting assignment:", error);
        return NextResponse.json({
            error: "Error interno del servidor",
            details: error.message,
        }, { status: 500 });
    }
}
