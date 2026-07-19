import { IAssignmentRepository } from "../../domain/repository/IAssignmentRepository";

export class SubmitStudentAssignmentUseCase {
    constructor(private readonly assignmentRepository: IAssignmentRepository) {}

    async execute(userId: number, assignmentId: number) {
        const isOwner = await this.assignmentRepository.verifyOwnership(assignmentId, userId);
        if (!isOwner) {
            throw new Error("FORBIDDEN: User does not own this assignment");
        }

        const completion = await this.assignmentRepository.getAssignmentCompletion(assignmentId);
        if (completion.totalIndicators === 0 || completion.missing.length > 0) {
            const error: any = new Error("INCOMPLETE: Assignment has unanswered indicators or missing required comment/evidence");
            error.missing = completion.missing;
            throw error;
        }

        return await this.assignmentRepository.submitAssignment(assignmentId);
    }
}
