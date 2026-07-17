import { requireApprovedSession } from "../../../../../lib/apiAuth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Role } from "../../../../../src/core/domain/entities/User";
import { SaveJudgementSchema } from "../../../../../src/core/application/dtos/AssignmentDTO";
import { SaveJudgementUseCase } from "../../../../../src/core/application/use-cases/SaveJudgement";
import { PrismaAssignmentRepository } from "../../../../../src/infrastructure/persistence/PrismaAssignmentRepository";

const repository = new PrismaAssignmentRepository();
const saveJudgementUseCase = new SaveJudgementUseCase(repository);

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

        const json = await request.json();
        const body = SaveJudgementSchema.parse(json);

        const result = await saveJudgementUseCase.execute(session.user.id, assignmentId, body);
        return NextResponse.json(result);

    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: "Error de validación", details: error.issues }, { status: 400 });
        }
        if (error.message.includes("FORBIDDEN")) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }
        if (error.message.includes("VALIDATION")) {
            return NextResponse.json({ message: error.message }, { status: 409 });
        }

        console.error("Error at saving judgement:", error);
        return NextResponse.json({
            error: "Error interno del servidor",
            details: error.message,
        }, { status: 500 });
    }
}
