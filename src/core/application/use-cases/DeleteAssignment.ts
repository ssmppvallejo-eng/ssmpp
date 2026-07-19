import { IAssignmentRepository } from "../../domain/repository/IAssignmentRepository";

export class DeleteAssignmentUseCase {
    constructor(private readonly assignmentRepository: IAssignmentRepository) {}

    async execute(assignmentId: number): Promise<void> {
        const assignment = await this.assignmentRepository.getAssignmentStatus(assignmentId);
        if (!assignment) {
            throw new Error("NOT_FOUND: Assignment not found");
        }

        await this.assignmentRepository.deleteAssignment(assignmentId);
    }
}
