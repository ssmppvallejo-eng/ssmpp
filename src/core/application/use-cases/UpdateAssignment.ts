import { IAssignmentRepository, UpdateAssignmentData } from "../../domain/repository/IAssignmentRepository";
import { IUserRepository } from "../../domain/repository/IUserRepository";
import { AccessStatus } from "../../domain/entities/User";

export class UpdateAssignmentUseCase {
    constructor(
        private readonly assignmentRepository: IAssignmentRepository,
        private readonly userRepository: IUserRepository,
    ) {}

    async execute(assignmentId: number, data: UpdateAssignmentData) {
        const assignment = await this.assignmentRepository.getAssignmentStatus(assignmentId);
        if (!assignment) {
            throw new Error("NOT_FOUND: Assignment not found");
        }

        if (data.userIds) {
            const userIds = [...new Set(data.userIds)];
            const users = await this.userRepository.findByIds(userIds);
            if (users.length !== userIds.length) {
                throw new Error("VALIDATION: some users do not exist");
            }
            if (users.some((user) => user.accessStatus !== AccessStatus.APROBADO)) {
                throw new Error("VALIDATION: all assigned users must be approved");
            }
            data = { ...data, userIds };
        }

        return await this.assignmentRepository.updateAssignment(assignmentId, data);
    }
}
