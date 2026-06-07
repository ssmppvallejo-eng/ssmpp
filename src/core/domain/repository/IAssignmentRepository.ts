import { SaveAssignmentResponseDTO } from "../../application/dtos/AssignmentDTO";

export interface IAssignmentRepository {
    saveDescriptorResponse(data: SaveAssignmentResponseDTO): Promise<any>;
    findAssignmentById(id: number): Promise<any | null>;
    findStudentAssignments(userId: number): Promise<any[]>;
    verifyOwnership(assignmentId: number, userId: number): Promise<boolean>;
}
