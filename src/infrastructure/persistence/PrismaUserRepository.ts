import { prisma } from "../../../lib/prisma";
import { User, Role } from "../../core/domain/entities/User";
import { IUserRepository } from "../../core/domain/repository/IUserRepository";

export class PrismaUserRepository implements IUserRepository {
  async findAll(): Promise<User[]> {
    const users = await prisma.user.findMany({ orderBy: { id: "asc" } });
    return users as User[];
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    return user as User | null;
  }

  async findById(id: number): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    return user as User | null;
  }

  async create(data: Partial<User>): Promise<User> {
    if (!data.email) throw new Error("Email is required");
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        image: data.image,
        role: data.role as any,
        accessStatus: data.accessStatus as any,
      },
    });
    return user as User;
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...data,
        role: data.role as any,
      },
    });
    return user as User;
  }
}
