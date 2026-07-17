import { prisma } from "../../../lib/prisma";
import { CreateAssignmentData, IAssignmentRepository } from "../../core/domain/repository/IAssignmentRepository";
import { SaveAssignmentResponseDTO } from "../../core/application/dtos/AssignmentDTO";

export class PrismaAssignmentRepository implements IAssignmentRepository {
    
    async saveDescriptorResponse(data: SaveAssignmentResponseDTO): Promise<any> {
        const optionalData = {
            ...(data.comment !== undefined && { comment: data.comment }),
        };

        const descriptor = await prisma.assignmentIndicatorDescriptor.upsert({
            where: {
                assignmentIndicatorId_descriptorId: {
                    assignmentIndicatorId: data.assignmentIndicatorId,
                    descriptorId: data.descriptorId,
                },
            },
            create: {
                ...optionalData,
                assignmentIndicatorId: data.assignmentIndicatorId,
                descriptorId: data.descriptorId,
                valueAssigned: data.valueAssigned,
                complete: true,
            },
            update: {
                ...optionalData,
                valueAssigned: data.valueAssigned,
                complete: true,
            }
        });

        return descriptor;
    }

    async findAssignmentById(id: number): Promise<any | null> {
        return await prisma.assignment.findUnique({
            where: { id },
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
                        id: true,
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
                        },
                        descriptorAssignments: {
                            select: {
                                descriptorId: true,
                                valueAssigned: true,
                                comment: true,
                            }
                        }
                    }
                }
            }
        });
    }

    async findStudentAssignments(userId: number): Promise<any[]> {
        return await prisma.userAssignTo.findMany({
            where: {
                userId: userId,
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
    }

    async verifyIndicatorInAssignment(assignmentIndicatorId: number, assignmentId: number): Promise<boolean> {
        const assignmentIndicator = await prisma.assignmentIndicator.findFirst({
            where: { id: assignmentIndicatorId, assignmentId },
            select: { id: true },
        });
        return !!assignmentIndicator;
    }

    async verifyOwnership(assignmentId: number, userId: number): Promise<boolean> {
        const isMyActivity = await prisma.userAssignTo.findUnique({
            where: {
                assignmentId_userId: {
                    userId: userId,
                    assignmentId: assignmentId
                }
            },
        });
        return !!isMyActivity;
    }

    async getAssignmentCompletion(assignmentId: number): Promise<{ totalIndicators: number; answeredIndicators: number }> {
        const assignmentIndicators = await prisma.assignmentIndicator.findMany({
            where: { assignmentId },
            select: {
                id: true,
                descriptorAssignments: {
                    where: { complete: true },
                    select: { assignmentIndicatorId: true },
                    take: 1,
                },
            },
        });

        return {
            totalIndicators: assignmentIndicators.length,
            answeredIndicators: assignmentIndicators.filter((indicator) => indicator.descriptorAssignments.length > 0).length,
        };
    }

    async submitAssignment(assignmentId: number): Promise<any> {
        return await prisma.assignment.update({
            where: { id: assignmentId },
            data: { status: "ENVIADO" },
        });
    }

    async findAllWithDetails(): Promise<any[]> {
        return await prisma.assignment.findMany({
            orderBy: { id: "desc" },
            include: {
                dimension: {
                    select: { code: true, title: true },
                },
                owner: {
                    select: { name: true, email: true },
                },
                assignedUsers: {
                    select: {
                        user: {
                            select: { id: true, name: true, email: true, image: true },
                        },
                    },
                },
                _count: {
                    select: { indicators: true },
                },
            },
        });
    }

    async dimensionExists(dimensionId: number): Promise<boolean> {
        const dimension = await prisma.dimension.findUnique({
            where: { id: dimensionId },
            select: { id: true },
        });
        return !!dimension;
    }

    async getTemplateIndicatorIds(templateId: number): Promise<number[] | null> {
        const template = await prisma.template.findUnique({
            where: { id: templateId },
            select: {
                indicators: { select: { indicatorId: true } },
            },
        });

        if (!template) return null;
        return template.indicators.map((entry) => entry.indicatorId);
    }

    async countIndicatorsInDimension(indicatorIds: number[], dimensionId: number): Promise<number> {
        return await prisma.indicator.count({
            where: {
                id: { in: indicatorIds },
                judgement: { component: { dimensionId } },
            },
        });
    }

    async createAssignment(data: CreateAssignmentData): Promise<any> {
        // Los creates anidados corren en una sola transaccion de Prisma.
        return await prisma.assignment.create({
            data: {
                ownerId: data.ownerId,
                dimensionId: data.dimensionId,
                assignmentDate: new Date(),
                submissionDate: data.dueDate,
                indicators: {
                    create: data.indicatorIds.map((indicatorId) => ({ indicatorId })),
                },
                assignedUsers: {
                    create: data.userIds.map((userId) => ({ userId })),
                },
            },
            include: {
                dimension: { select: { code: true, title: true } },
                _count: { select: { indicators: true, assignedUsers: true } },
            },
        });
    }
}
