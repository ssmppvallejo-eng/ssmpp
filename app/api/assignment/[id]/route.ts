import { prisma } from '../../../../lib/prisma';
import { authOptions } from '../../../../lib/auth';
import { getServerSession } from 'next-auth';
import { SYSTEM_ROLES } from '../../../../constants/assignmentStatus';
import { NextRequest, NextResponse } from 'next/server';
import { SaveAssignmentResponseSchema } from '../../../../src/core/application/dtos/AssignmentDTO';
import { z } from 'zod';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    const assignmentId = Number(id);

    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const isMyActivity = await prisma.userAssignTo.findUnique({
            where: {
                assignmentId_userId: {
                    userId: session.user.id,
                    assignmentId: assignmentId
                }
            },
        });

        if (!isMyActivity) {
            return new Response("Forbidden", { status: 403 });
        }

        const dbAssignment = await prisma.assignment.findUnique({
            where: { id: assignmentId },
            include: {
                dimension: {
                    select: {
                        code: true,
                        title: true,
                        description: true,
                        components: {
                            select: {
                                id: true,
                                code: true,
                                title: true,
                                description: true,
                                dimensionId: true,
                            }
                        }
                    },
                },
                indicators: {
                    select: {
                        indicator: {
                            select: {
                                id: true,
                                code: true,
                                description: true,
                                descriptors: {
                                    select: {
                                        id: true,
                                        title: true,
                                        description: true,
                                        value: true,
                                    }
                                },
                                judgement: {
                                    select: {
                                        id: true,
                                        code: true,
                                        title: true,
                                        description: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!dbAssignment) {
            return NextResponse.json({ message: "Assignment not found" }, { status: 404 });
        }

        const assignment: any = {
            assignmentDate: dbAssignment.assignmentDate,
            submissionDate: dbAssignment.submissionDate,
            status: dbAssignment.status,
            Dimension: {
                code: dbAssignment.dimension.code,
                title: dbAssignment.dimension.title,
                description: dbAssignment.dimension.description,
                Component: dbAssignment.dimension.components[0],
            },
            Judgement: []
        };

        const Judgement = dbAssignment.indicators;

        assignment.Judgement = Judgement.reduce((acc: any[], item: any) => {
            const indicator = item.indicator;
            const judgementData = indicator.judgement;
            const judgementId = judgementData.id;

            let judgement = acc.find(j => j.id === judgementId);

            if (!judgement) {
                judgement = {
                    id: judgementData.id,
                    code: judgementData.code,
                    title: judgementData.title,
                    description: judgementData.description,
                    Indicators: []
                };
                acc.push(judgement);
            }

            judgement.Indicators.push({
                id: indicator.id,
                code: indicator.code,
                description: indicator.description,
                descriptors: indicator.descriptors
            });

            return acc;
        }, []);

        return NextResponse.json(assignment);
    } catch (error: any) {
        console.error("Error at fetching assignments:", error);
        return NextResponse.json({
            error: "Error interno del servidor",
            details: error.message,
        }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    
    try {
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const json = await request.json();
        const body = SaveAssignmentResponseSchema.parse(json);

        switch (session.user.role) {
            case SYSTEM_ROLES.ESTUDIANTE:
                const result = await postStudentAssignment(body);
                return NextResponse.json(result);
            default:
                return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({
                error: "Error de validación",
                details: error.errors
            }, { status: 400 });
        }

        console.error("Error at posting assignments:", error);
        return NextResponse.json({
            error: "Error interno del servidor",
            details: error.message
        }, { status: 500 });
    }
}

async function postStudentAssignment(body: z.infer<typeof SaveAssignmentResponseSchema>) {
    const optionalData = {
        ...(body.comment !== undefined && { comment: body.comment }),
    };

    const descriptor = await prisma.assignmentIndicatorDescriptor.upsert({
        where: {
            assignmentIndicatorId_descriptorId: {
                assignmentIndicatorId: body.assignmentIndicatorId,
                descriptorId: body.descriptorId,
            },
        },
        create: {
            ...optionalData,
            assignmentIndicatorId: body.assignmentIndicatorId,
            descriptorId: body.descriptorId,
            valueAssigned: body.valueAssigned,
        },
        update: {
            ...optionalData,
            valueAssigned: body.valueAssigned,
        }
    });

    return descriptor;
}
