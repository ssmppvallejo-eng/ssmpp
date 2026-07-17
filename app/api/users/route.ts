import { NextRequest, NextResponse } from 'next/server';
import { requireApprovedSession } from '../../../lib/apiAuth';
import { Role } from '../../../src/core/domain/entities/User';
import { ListUsersUseCase } from '../../../src/core/application/use-cases/ListUsers';
import { PrismaUserRepository } from '../../../src/infrastructure/persistence/PrismaUserRepository';

const repository = new PrismaUserRepository();
const listUsersUseCase = new ListUsersUseCase(repository);

export async function GET(request: NextRequest) {
    try {
        const { session, error } = await requireApprovedSession([Role.ADMINISTRADOR]);
        if (error) return error;

        const users = await listUsersUseCase.execute();

        return NextResponse.json(users);

    } catch (error: any) {
        console.error('Error at fetching users: ', error);
        return NextResponse.json({
            error: "Error interno del servidor al obtener usuarios",
            details: error.message,
        }, { status: 500 });
    }
}
