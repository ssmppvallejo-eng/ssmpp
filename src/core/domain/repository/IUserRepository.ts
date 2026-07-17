import { User } from "../entities/User";

export interface IUserRepository {
  findAll(): Promise<User[]>;
  findByIds(ids: number[]): Promise<User[]>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  create(user: Partial<User>): Promise<User>;
  update(id: number, user: Partial<User>): Promise<User>;
}
