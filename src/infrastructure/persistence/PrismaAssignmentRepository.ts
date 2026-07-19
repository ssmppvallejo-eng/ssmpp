import { prisma } from "../../../lib/prisma";
import { CreateAssignmentData, IAssignmentRepository, UpdateAssignmentData } from "../../core/domain/repository/IAssignmentRepository";
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
                                evidenceName: true,
                                evidenceUrl: true,
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
        return await this.updateStatus(assignmentId, "ENVIADO");
    }

    async getAssignmentStatus(assignmentId: number): Promise<{ id: number; status: string } | null> {
        return await prisma.assignment.findUnique({
            where: { id: assignmentId },
            select: { id: true, status: true },
        });
    }

    async updateStatus(assignmentId: number, status: string): Promise<any> {
        return await prisma.assignment.update({
            where: { id: assignmentId },
            data: { status: status as any },
        });
    }

    async addUserToAssignment(assignmentId: number, userId: number): Promise<any> {
        return await prisma.userAssignTo.create({
            data: { assignmentId, userId },
        });
    }

    async saveJudgement(assignmentIndicatorId: number, evaluationValue: number, note?: string | null): Promise<number> {
        const result = await prisma.assignmentIndicatorDescriptor.updateMany({
            where: { assignmentIndicatorId },
            data: {
                evaluationValue,
                ...(note !== undefined && { note }),
            },
        });
        return result.count;
    }

    async getJudgementCompletion(assignmentId: number): Promise<{ total: number; judged: number }> {
        const assignmentIndicators = await prisma.assignmentIndicator.findMany({
            where: { assignmentId },
            select: {
                descriptorAssignments: {
                    where: { evaluationValue: { not: null } },
                    select: { id: true },
                    take: 1,
                },
            },
        });

        return {
            total: assignmentIndicators.length,
            judged: assignmentIndicators.filter((indicator) => indicator.descriptorAssignments.length > 0).length,
        };
    }

    async updateAssignment(assignmentId: number, data: UpdateAssignmentData): Promise<any> {
        const operations: any[] = [];

        if (data.userIds) {
            operations.push(
                prisma.userAssignTo.deleteMany({ where: { assignmentId } }),
                prisma.userAssignTo.createMany({
                    data: data.userIds.map((userId) => ({ assignmentId, userId })),
                }),
            );
        }

        operations.push(
            prisma.assignment.update({
                where: { id: assignmentId },
                data: {
                    ...(data.dueDate !== undefined && { submissionDate: data.dueDate }),
                },
                include: {
                    dimension: { select: { code: true, title: true } },
                    assignedUsers: { select: { user: { select: { id: true, name: true, email: true } } } },
                },
            }),
        );

        const results = await prisma.$transaction(operations);
        return results[results.length - 1];
    }

    async deleteAssignment(assignmentId: number): Promise<void> {
        // Se recolectan los archivos de evidencia referenciados para borrarlos
        // junto con la asignacion.
        const responses = await prisma.assignmentIndicatorDescriptor.findMany({
            where: { assignmentIndicator: { assignmentId } },
            select: { evidenceUrl: true },
        });

        const evidenceIds = responses
            .map((response) => response.evidenceUrl?.match(/^\/api\/evidence\/(\d+)$/)?.[1])
            .filter((id): id is string => !!id)
            .map(Number);

        await prisma.$transaction([
            prisma.assignmentIndicatorDescriptor.deleteMany({ where: { assignmentIndicator: { assignmentId } } }),
            prisma.assignmentIndicator.deleteMany({ where: { assignmentId } }),
            prisma.userAssignTo.deleteMany({ where: { assignmentId } }),
            prisma.assignment.delete({ where: { id: assignmentId } }),
            ...(evidenceIds.length ? [prisma.evidenceFile.deleteMany({ where: { id: { in: evidenceIds } } })] : []),
        ]);
    }

    async expireOverdueAssignments(): Promise<number> {
        // RF-SIS-007: las evaluaciones no enviadas ni completadas cuya fecha
        // limite ya vencio pasan a NO_COMPLETADO. Es una operacion de
        // mantenimiento: si falla, no debe tumbar la consulta que la disparo.
        try {
            const result = await prisma.assignment.updateMany({
                where: {
                    submissionDate: { lt: new Date() },
                    status: { in: ["PENDIENTE", "EN_PROCESO", "EN_REVISION"] },
                },
                data: { status: "NO_COMPLETADO" },
            });
            return result.count;
        } catch (error) {
            console.error("Error expiring overdue assignments:", error);
            return 0;
        }
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
                indicators: {
                    select: {
                        descriptorAssignments: {
                            where: { complete: true },
                            select: { id: true },
                            take: 1,
                        },
                    },
                },
                _count: {
                    select: { indicators: true },
                },
            },
        });
    }

    async findAssignmentForReview(id: number): Promise<any | null> {
        return await prisma.assignment.findUnique({
            where: { id },
            include: {
                dimension: {
                    select: { code: true, title: true, description: true },
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
                indicators: {
                    select: {
                        id: true,
                        indicator: {
                            select: {
                                id: true,
                                code: true,
                                description: true,
                                justification: true,
                                descriptors: {
                                    orderBy: { value: "asc" },
                                    select: {
                                        id: true,
                                        title: true,
                                        description: true,
                                        value: true,
                                    },
                                },
                                judgement: {
                                    select: {
                                        id: true,
                                        code: true,
                                        title: true,
                                        description: true,
                                    },
                                },
                            },
                        },
                        descriptorAssignments: {
                            select: {
                                descriptorId: true,
                                valueAssigned: true,
                                comment: true,
                                evaluationValue: true,
                                note: true,
                                evidenceName: true,
                                evidenceUrl: true,
                                complete: true,
                            },
                        },
                    },
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
