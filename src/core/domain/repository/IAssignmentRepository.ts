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
    verifyIndicatorInAssignment(assignmentIndicatorId: number, assignmentId: number): Promise<boolean>;
    getAssignmentCompletion(assignmentId: number): Promise<{ totalIndicators: number; answeredIndicators: number }>;
    submitAssignment(assignmentId: number): Promise<any>;
    getAssignmentStatus(assignmentId: number): Promise<{ id: number; status: string } | null>;
    updateStatus(assignmentId: number, status: string): Promise<any>;
    addUserToAssignment(assignmentId: number, userId: number): Promise<any>;
    saveJudgement(assignmentIndicatorId: number, evaluationValue: number, note?: string | null): Promise<number>;
    getJudgementCompletion(assignmentId: number): Promise<{ total: number; judged: number }>;
    findAllWithDetails(): Promise<any[]>;
    findAssignmentForReview(id: number): Promise<any | null>;
    dimensionExists(dimensionId: number): Promise<boolean>;
    getTemplateIndicatorIds(templateId: number): Promise<number[] | null>;
    countIndicatorsInDimension(indicatorIds: number[], dimensionId: number): Promise<number>;
    createAssignment(data: CreateAssignmentData): Promise<any>;
}
