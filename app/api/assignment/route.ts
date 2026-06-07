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

        if (session.user.role === 'ADMINISTRADOR') {
            const assignments = await prisma.assignment.findMany();
            return NextResponse.json(assignments);
        }

        return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    } catch (error: any) {
        return NextResponse.json({
            error: "Error interno del servidor",
            details: error.message,
        }, { status: 500 });
    }
}
