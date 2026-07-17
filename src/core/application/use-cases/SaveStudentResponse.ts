import { IAssignmentRepository } from "../../domain/repository/IAssignmentRepository";
import { SaveAssignmentResponseDTO } from "../dtos/AssignmentDTO";

export class SaveStudentResponseUseCase {
    constructor(private readonly assignmentRepository: IAssignmentRepository) {}

    async execute(userId: number, assignmentId: number, data: SaveAssignmentResponseDTO) {
        
        // 1. Verify if the student owns the assignment
        const isOwner = await this.assignmentRepository.verifyOwnership(assignmentId, userId);
        if (!isOwner) {
            throw new Error("FORBIDDEN: User does not own this assignment");
        }

        // 2. Verify the indicator belongs to this assignment (prevents writing
        // responses into another assignment's indicators)
        const belongs = await this.assignmentRepository.verifyIndicatorInAssignment(data.assignmentIndicatorId, assignmentId);
        if (!belongs) {
            throw new Error("FORBIDDEN: Indicator does not belong to this assignment");
        }

        // 3. Save the response
        const result = await this.assignmentRepository.saveDescriptorResponse(data);
        return result;
    }
}
