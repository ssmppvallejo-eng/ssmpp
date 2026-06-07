import { prisma } from '../../../lib/prisma';
import { authOptions } from '../../../lib/auth';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        if (!session.user.role) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        const users = await prisma.user.findMany();

        return NextResponse.json(users);

    } catch (error: any) {
        console.error('Error at fetching users: ', error);
        return NextResponse.json({
            error: "Error interno del servidor al obtener usuarios",
            details: error.message,
        }, { status: 500 });
    }
}
