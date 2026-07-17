import { SaveAssignmentResponseDTO } from "../../application/dtos/AssignmentDTO";

export interface CreateAssignmentData {
    ownerId: number;
    dimensionId: number;
    dueDate: Date;
    indicatorIds: number[];
    userIds: number[];
}

export interface IAssignmentRepository {
    saveDescriptorResponse(data: SaveAssignmentResponseDTO): Promise<any>;
    findAssignmentById(id: number): Promise<any | null>;
    findStudentAssignments(userId: number): Promise<any[]>;
    verifyOwnership(assignmentId: number, userId: number): Promise<boolean>;
    getAssignmentCompletion(assignmentId: number): Promise<{ totalIndicators: number; answeredIndicators: number }>;
    submitAssignment(assignmentId: number): Promise<any>;
    findAllWithDetails(): Promise<any[]>;
    dimensionExists(dimensionId: number): Promise<boolean>;
    getTemplateIndicatorIds(templateId: number): Promise<number[] | null>;
    countIndicatorsInDimension(indicatorIds: number[], dimensionId: number): Promise<number>;
    createAssignment(data: CreateAssignmentData): Promise<any>;
}
