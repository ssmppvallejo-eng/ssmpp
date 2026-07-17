import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repository/IUserRepository";

export class ListUsersUseCase {
    constructor(private readonly userRepository: IUserRepository) {}

    async execute(): Promise<User[]> {
        return await this.userRepository.findAll();
    }
}
