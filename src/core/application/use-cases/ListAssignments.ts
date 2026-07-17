import { IAssignmentRepository } from "../../domain/repository/IAssignmentRepository";

export class ListAssignmentsUseCase {
    constructor(private readonly assignmentRepository: IAssignmentRepository) {}

    async execute() {
        return await this.assignmentRepository.findAllWithDetails();
    }
}
