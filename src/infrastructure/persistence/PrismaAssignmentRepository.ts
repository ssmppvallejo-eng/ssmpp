import { prisma } from "../../../lib/prisma";
import { IAssignmentRepository } from "../../core/domain/repository/IAssignmentRepository";
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
            },
            update: {
                ...optionalData,
                valueAssigned: data.valueAssigned,
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
}
