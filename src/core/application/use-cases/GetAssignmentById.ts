import { IAssignmentRepository } from "../../domain/repository/IAssignmentRepository";

export class GetAssignmentByIdUseCase {
    constructor(private readonly assignmentRepository: IAssignmentRepository) {}

    async execute(userId: number, assignmentId: number) {
        // 1. Verify ownership
        const isOwner = await this.assignmentRepository.verifyOwnership(assignmentId, userId);
        if (!isOwner) {
            throw new Error("FORBIDDEN: User does not own this assignment");
        }

        // 2. Fetch data
        const dbAssignment = await this.assignmentRepository.findAssignmentById(assignmentId);
        
        if (!dbAssignment) {
            throw new Error("NOT_FOUND: Assignment not found");
        }

        // 3. Transform data to match frontend requirements
        const assignment: any = {
            id: dbAssignment.id,
            assignmentDate: dbAssignment.assignmentDate,
            submissionDate: dbAssignment.submissionDate,
            submittedAt: dbAssignment.submittedAt,
            status: dbAssignment.status,
            Dimension: {
                code: dbAssignment.dimension.code,
                title: dbAssignment.dimension.title,
                description: dbAssignment.dimension.description,
                Component: dbAssignment.dimension.components[0],
            },
            Judgement: []
        };

        const Judgement = dbAssignment.indicators;

        assignment.Judgement = Judgement.reduce((acc: any[], item: any) => {
            const indicator = item.indicator;
            const judgementData = indicator.judgement;
            const judgementId = judgementData.id;

            let judgement = acc.find((j: any) => j.id === judgementId);

            if (!judgement) {
                judgement = {
                    id: judgementData.id,
                    code: judgementData.code,
                    title: judgementData.title,
                    description: judgementData.description,
                    Indicators: []
                };
                acc.push(judgement);
            }

            const savedResponse = item.descriptorAssignments?.[0] ?? null;

            judgement.Indicators.push({
                id: indicator.id,
                // Id del indicador dentro de esta asignacion: es el que se usa
                // para guardar respuestas (AssignmentIndicator.id).
                assignmentIndicatorId: item.id,
                code: indicator.code,
                description: indicator.description,
                descriptors: indicator.descriptors,
                savedResponse,
                requiresComment: indicator.requiresComment,
                requiresEvidence: indicator.requiresEvidence,
            });

            return acc;
        }, []);

        return assignment;
    }
}
