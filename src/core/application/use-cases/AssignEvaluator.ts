import { IAssignmentRepository } from "../../domain/repository/IAssignmentRepository";
import { IUserRepository } from "../../domain/repository/IUserRepository";
import { AccessStatus, Role } from "../../domain/entities/User";

/**
 * Asigna un evaluador a una evaluacion enviada. Al asignar el primero,
 * la asignacion pasa de ENVIADO a EN_REVISION.
 */
export class AssignEvaluatorUseCase {
    constructor(
        private readonly assignmentRepository: IAssignmentRepository,
        private readonly userRepository: IUserRepository,
    ) {}

    async execute(assignmentId: number, evaluatorUserId: number) {
        const assignment = await this.assignmentRepository.getAssignmentStatus(assignmentId);
        if (!assignment) {
            throw new Error("NOT_FOUND: Assignment not found");
        }

        if (assignment.status !== "ENVIADO" && assignment.status !== "EN_REVISION") {
            throw new Error("VALIDATION: only submitted assignments can be sent to review");
        }

        const evaluator = await this.userRepository.findById(evaluatorUserId);
        if (!evaluator) {
            throw new Error("NOT_FOUND: user does not exist");
        }
        if (evaluator.accessStatus !== AccessStatus.APROBADO) {
            throw new Error("VALIDATION: evaluator must be an approved user");
        }
        if (evaluator.role !== Role.EVALUADOR) {
            throw new Error("VALIDATION: user does not have the EVALUADOR role");
        }

        const alreadyAssigned = await this.assignmentRepository.verifyOwnership(assignmentId, evaluatorUserId);
        if (alreadyAssigned) {
            throw new Error("VALIDATION: user is already assigned to this assignment");
        }

        await this.assignmentRepository.addUserToAssignment(assignmentId, evaluatorUserId);

        if (assignment.status === "ENVIADO") {
            return await this.assignmentRepository.updateStatus(assignmentId, "EN_REVISION");
        }

        return assignment;
    }
}
