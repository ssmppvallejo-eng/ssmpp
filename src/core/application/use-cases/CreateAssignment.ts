import { IAssignmentRepository } from "../../domain/repository/IAssignmentRepository";
import { IUserRepository } from "../../domain/repository/IUserRepository";
import { AccessStatus } from "../../domain/entities/User";
import { CreateAssignmentDTO } from "../dtos/AssignmentDTO";

export class CreateAssignmentUseCase {
    constructor(
        private readonly assignmentRepository: IAssignmentRepository,
        private readonly userRepository: IUserRepository,
    ) {}

    async execute(adminId: number, input: CreateAssignmentDTO) {
        const dimensionOk = await this.assignmentRepository.dimensionExists(input.dimensionId);
        if (!dimensionOk) {
            throw new Error("NOT_FOUND: dimension does not exist");
        }

        let indicatorIds: number[];
        if (input.templateId !== undefined) {
            const templateIndicators = await this.assignmentRepository.getTemplateIndicatorIds(input.templateId);
            if (templateIndicators === null) {
                throw new Error("NOT_FOUND: template does not exist");
            }
            indicatorIds = templateIndicators;
        } else {
            indicatorIds = input.indicatorIds ?? [];
        }

        indicatorIds = [...new Set(indicatorIds)];
        if (indicatorIds.length === 0) {
            throw new Error("VALIDATION: assignment must include at least one indicator");
        }

        const inDimension = await this.assignmentRepository.countIndicatorsInDimension(indicatorIds, input.dimensionId);
        if (inDimension !== indicatorIds.length) {
            throw new Error("VALIDATION: some indicators do not exist or do not belong to the dimension");
        }

        const userIds = [...new Set(input.userIds)];
        const users = await this.userRepository.findByIds(userIds);
        if (users.length !== userIds.length) {
            throw new Error("VALIDATION: some users do not exist");
        }
        if (users.some((user) => user.accessStatus !== AccessStatus.APROBADO)) {
            throw new Error("VALIDATION: all assigned users must be approved");
        }

        return await this.assignmentRepository.createAssignment({
            ownerId: adminId,
            dimensionId: input.dimensionId,
            dueDate: input.dueDate,
            indicatorIds,
            userIds,
        });
    }
}
