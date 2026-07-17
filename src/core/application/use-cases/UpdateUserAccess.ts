import { AccessStatus, Role, User } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repository/IUserRepository";

export interface UpdateUserAccessInput {
    accessStatus?: AccessStatus;
    role?: Role;
}

export class UpdateUserAccessUseCase {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute(adminId: number, targetUserId: number, changes: UpdateUserAccessInput): Promise<User> {
        // Un administrador no puede modificarse a si mismo: evita que se
        // rechace o degrade y deje al sistema sin administradores.
        if (adminId === targetUserId) {
            throw new Error("FORBIDDEN: an administrator cannot modify their own account");
        }

        const target = await this.userRepository.findById(targetUserId);
        if (!target) {
            throw new Error("NOT_FOUND: user does not exist");
        }

        return await this.userRepository.update(targetUserId, {
            ...(changes.accessStatus !== undefined && { accessStatus: changes.accessStatus }),
            ...(changes.role !== undefined && { role: changes.role }),
        });
    }
}
