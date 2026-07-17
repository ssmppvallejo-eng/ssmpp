import { IAssignmentRepository } from "../../domain/repository/IAssignmentRepository";

/**
 * Cierra la revision de una asignacion: exige que todos los indicadores
 * tengan juicio de valor y pasa el estado a COMPLETADO.
 */
export class CompleteReviewUseCase {
    constructor(private readonly assignmentRepository: IAssignmentRepository) {}

    async execute(evaluatorId: number, assignmentId: number) {
        const isMember = await this.assignmentRepository.verifyOwnership(assignmentId, evaluatorId);
        if (!isMember) {
            throw new Error("FORBIDDEN: User is not assigned to this assignment");
        }

        const assignment = await this.assignmentRepository.getAssignmentStatus(assignmentId);
        if (!assignment || assignment.status !== "EN_REVISION") {
            throw new Error("VALIDATION: assignment is not under review");
        }

        const completion = await this.assignmentRepository.getJudgementCompletion(assignmentId);
        if (completion.total === 0 || completion.judged < completion.total) {
            throw new Error("INCOMPLETE: some indicators are missing a value judgement");
        }

        return await this.assignmentRepository.updateStatus(assignmentId, "COMPLETADO");
    }
}
