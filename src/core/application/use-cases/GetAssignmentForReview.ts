import { IAssignmentRepository } from "../../domain/repository/IAssignmentRepository";

/**
 * Vista de supervision (RF-ASIG-010): jerarquia completa de la asignacion con
 * la respuesta capturada por indicador y el juicio de valor cuando exista.
 * No exige pertenencia; el rol se valida en la ruta (admin/coordinador).
 */
export class GetAssignmentForReviewUseCase {
    constructor(private readonly assignmentRepository: IAssignmentRepository) {}

    async execute(assignmentId: number) {
        await this.assignmentRepository.expireOverdueAssignments();
        const dbAssignment = await this.assignmentRepository.findAssignmentForReview(assignmentId);

        if (!dbAssignment) {
            throw new Error("NOT_FOUND: Assignment not found");
        }

        const judgements = dbAssignment.indicators.reduce((acc: any[], item: any) => {
            const indicator = item.indicator;
            const judgementData = indicator.judgement;

            let judgement = acc.find((j: any) => j.id === judgementData.id);
            if (!judgement) {
                judgement = {
                    id: judgementData.id,
                    code: judgementData.code,
                    title: judgementData.title,
                    description: judgementData.description,
                    indicators: [],
                };
                acc.push(judgement);
            }

            judgement.indicators.push({
                id: indicator.id,
                assignmentIndicatorId: item.id,
                code: indicator.code,
                description: indicator.description,
                justification: indicator.justification,
                requiresComment: indicator.requiresComment,
                requiresEvidence: indicator.requiresEvidence,
                descriptors: indicator.descriptors,
                response: item.descriptorAssignments?.[0] ?? null,
            });

            return acc;
        }, []);

        const totalIndicators = dbAssignment.indicators.length;
        const answeredIndicators = dbAssignment.indicators.filter(
            (item: any) => item.descriptorAssignments?.some((response: any) => response.complete)
        ).length;

        return {
            id: dbAssignment.id,
            status: dbAssignment.status,
            assignmentDate: dbAssignment.assignmentDate,
            submissionDate: dbAssignment.submissionDate,
            submittedAt: dbAssignment.submittedAt,
            dimension: dbAssignment.dimension,
            owner: dbAssignment.owner,
            assignedUsers: dbAssignment.assignedUsers.map((entry: any) => entry.user),
            progress: { total: totalIndicators, answered: answeredIndicators },
            judgements,
        };
    }
}
