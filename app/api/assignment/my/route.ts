import { prisma } from '../../../../lib/prisma';
import { requireApprovedSession } from '../../../../lib/apiAuth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { session, error } = await requireApprovedSession();
        if (error) return error;

        switch (session.user.role) {
            case 'ESTUDIANTE':
                const dbAssignment = await prisma.userAssignTo.findMany({
                    where: {
                        userId: session.user.id,
                    },
                    include: {
                        assignment: {
                            select: {
                                assignmentDate: true,
                                submissionDate: true,
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

                let assignments = [];

                if (dbAssignment.length) {
                    assignments = dbAssignment.map((ass) => {
                        return {
                            assignmentId: ass.assignmentId,
                            title: ass.assignment.dimension.title,
                            index: ass.assignment.dimension.code,
                            description: ass.assignment?.dimension?.description ?? "",
                            status: ass.assignment.status,
                            assignmentDate: ass.assignment.assignmentDate,
                            submissionDate: ass.assignment.submissionDate
                        };
                    });
                }

                return NextResponse.json(assignments);

            default:
                return new Response("Forbidden", { status: 403 });
        }

    } catch (error: any) {
        console.error("Error at fetching assignments:", error);
        return NextResponse.json({
            error: "Error interno del servidor",
            details: error.message,
        }, { status: 500 });
    }
}
