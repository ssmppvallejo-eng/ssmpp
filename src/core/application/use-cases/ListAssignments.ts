import { IAssignmentRepository } from "../../domain/repository/IAssignmentRepository";

export class ListAssignmentsUseCase {
    constructor(private readonly assignmentRepository: IAssignmentRepository) {}

    async execute() {
        await this.assignmentRepository.expireOverdueAssignments();
        const assignments = await this.assignmentRepository.findAllWithDetails();

        return assignments.map(({ indicators, ...assignment }) => ({
            ...assignment,
            progress: {
                total: indicators.length,
                answered: indicators.filter((indicator: any) => indicator.descriptorAssignments.length > 0).length,
            },
        }));
    }
}
