import { SaveAssignmentResponseDTO } from "../../application/dtos/AssignmentDTO";

export interface IAssignmentRepository {
    saveDescriptorResponse(data: SaveAssignmentResponseDTO): Promise<any>;
    findAssignmentById(id: number): Promise<any | null>;
    findStudentAssignments(userId: number): Promise<any[]>;
    verifyOwnership(assignmentId: number, userId: number): Promise<boolean>;
    getAssignmentCompletion(assignmentId: number): Promise<{ totalIndicators: number; answeredIndicators: number }>;
    submitAssignment(assignmentId: number): Promise<any>;
}
