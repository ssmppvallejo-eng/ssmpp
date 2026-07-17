import { requireApprovedSession } from "../../../../../lib/apiAuth";
import { NextRequest, NextResponse } from "next/server";
import { Role } from "../../../../../src/core/domain/entities/User";
import { CompleteReviewUseCase } from "../../../../../src/core/application/use-cases/CompleteReview";
import { PrismaAssignmentRepository } from "../../../../../src/infrastructure/persistence/PrismaAssignmentRepository";

const repository = new PrismaAssignmentRepository();
const completeReviewUseCase = new CompleteReviewUseCase(repository);

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const assignmentId = Number(id);

    try {
        const { session, error } = await requireApprovedSession([Role.EVALUADOR, Role.COORDINADOR]);
        if (error) return error;

        if (!Number.isInteger(assignmentId)) {
            return NextResponse.json({ message: "Invalid assignment id" }, { status: 400 });
        }

        const result = await completeReviewUseCase.execute(session.user.id, assignmentId);
        return NextResponse.json(result);

    } catch (error: any) {
        if (error.message.includes("FORBIDDEN")) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }
        if (error.message.includes("INCOMPLETE") || error.message.includes("VALIDATION")) {
            return NextResponse.json({ message: error.message }, { status: 409 });
        }

        console.error("Error at completing review:", error);
        return NextResponse.json({
            error: "Error interno del servidor",
            details: error.message,
        }, { status: 500 });
    }
}
