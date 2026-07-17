import { IAssignmentRepository } from "../../domain/repository/IAssignmentRepository";
import { SaveJudgementDTO } from "../dtos/AssignmentDTO";

export class SaveJudgementUseCase {
    constructor(private readonly assignmentRepository: IAssignmentRepository) {}

    async execute(evaluatorId: number, assignmentId: number, data: SaveJudgementDTO) {
        const isMember = await this.assignmentRepository.verifyOwnership(assignmentId, evaluatorId);
        if (!isMember) {
            throw new Error("FORBIDDEN: User is not assigned to this assignment");
        }

        const assignment = await this.assignmentRepository.getAssignmentStatus(assignmentId);
        if (!assignment || assignment.status !== "EN_REVISION") {
            throw new Error("VALIDATION: assignment is not under review");
        }

        const belongs = await this.assignmentRepository.verifyIndicatorInAssignment(data.assignmentIndicatorId, assignmentId);
        if (!belongs) {
            throw new Error("FORBIDDEN: Indicator does not belong to this assignment");
        }

        const updated = await this.assignmentRepository.saveJudgement(
            data.assignmentIndicatorId,
            data.evaluationValue,
            data.note,
        );

        if (updated === 0) {
            throw new Error("VALIDATION: the indicator has no response to judge");
        }

        return { assignmentIndicatorId: data.assignmentIndicatorId, evaluationValue: data.evaluationValue, note: data.note ?? null };
    }
}
