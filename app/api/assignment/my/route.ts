import { prisma } from '../../../../lib/prisma';
import { requireApprovedSession } from '../../../../lib/apiAuth';
import { NextRequest, NextResponse } from 'next/server';
import { PrismaAssignmentRepository } from '../../../../src/infrastructure/persistence/PrismaAssignmentRepository';

const repository = new PrismaAssignmentRepository();

export async function GET(request: NextRequest) {
    try {
        const { session, error } = await requireApprovedSession();
        if (error) return error;

        await repository.expireOverdueAssignments();

        // La pertenencia se define por UserAssignTo, sin importar el rol:
        // quien fue asignado a una actividad puede verla.
        const dbAssignment = await prisma.userAssignTo.findMany({
            where: {
                userId: session.user.id,
            },
            include: {
                assignment: {
                    select: {
                        assignmentDate: true,
                        submissionDate: true,
                        submittedAt: true,
                        status: true,
                        dimension: {
                            select: {
                                code: true,
                                title: true,
                                description: true,
                            },
                        },
                    },
                },
            },
        });

        const assignments = dbAssignment.map((ass) => {
            return {
                assignmentId: ass.assignmentId,
                title: ass.assignment.dimension.title,
                index: ass.assignment.dimension.code,
                description: ass.assignment?.dimension?.description ?? "",
                status: ass.assignment.status,
                assignmentDate: ass.assignment.assignmentDate,
                submissionDate: ass.assignment.submissionDate,
                submittedAt: ass.assignment.submittedAt
            };
        });

        return NextResponse.json(assignments);

    } catch (error: any) {
        console.error("Error at fetching assignments:", error);
        return NextResponse.json({
            error: "Error interno del servidor",
            details: error.message,
        }, { status: 500 });
    }
}
