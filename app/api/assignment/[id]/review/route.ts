import { requireApprovedSession } from "../../../../../lib/apiAuth";
import { NextRequest, NextResponse } from "next/server";
import { Role } from "../../../../../src/core/domain/entities/User";
import { GetAssignmentForReviewUseCase } from "../../../../../src/core/application/use-cases/GetAssignmentForReview";
import { PrismaAssignmentRepository } from "../../../../../src/infrastructure/persistence/PrismaAssignmentRepository";

const repository = new PrismaAssignmentRepository();
const reviewUseCase = new GetAssignmentForReviewUseCase(repository);

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const assignmentId = Number(id);

    try {
        const { session, error } = await requireApprovedSession([Role.ADMINISTRADOR, Role.COORDINADOR, Role.EVALUADOR]);
        if (error) return error;

        if (!Number.isInteger(assignmentId)) {
            return NextResponse.json({ message: "Invalid assignment id" }, { status: 400 });
        }

        // Admin y coordinador supervisan cualquier asignacion; el evaluador
        // solo las que tiene asignadas.
        if (session.user.role === Role.EVALUADOR) {
            const isMember = await repository.verifyOwnership(assignmentId, session.user.id);
            if (!isMember) {
                return NextResponse.json({ message: "Forbidden" }, { status: 403 });
            }
        }

        const assignment = await reviewUseCase.execute(assignmentId);
        return NextResponse.json(assignment);

    } catch (error: any) {
        if (error.message.includes("NOT_FOUND")) {
            return NextResponse.json({ message: "Assignment not found" }, { status: 404 });
        }

        console.error("Error at fetching assignment review:", error);
        return NextResponse.json({
            error: "Error interno del servidor",
            details: error.message,
        }, { status: 500 });
    }
}
