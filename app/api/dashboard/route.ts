import { prisma } from '../../../lib/prisma';
import { requireApprovedSession } from '../../../lib/apiAuth';
import { Role } from '../../../src/core/domain/entities/User';
import { NextRequest, NextResponse } from 'next/server';

// Metricas agregadas para el dashboard del administrador (Should del SRS:
// grafica por indicadores) y base para el futuro resumen con IA.
export async function GET(request: NextRequest) {
    try {
        const { error } = await requireApprovedSession([Role.ADMINISTRADOR]);
        if (error) return error;

        const [assignmentsByStatus, usersByRole, responses] = await Promise.all([
            prisma.assignment.groupBy({ by: ["status"], _count: true }),
            prisma.user.groupBy({ by: ["role"], where: { accessStatus: "APROBADO" }, _count: true }),
            prisma.assignmentIndicatorDescriptor.findMany({
                where: { complete: true },
                select: {
                    valueAssigned: true,
                    evaluationValue: true,
                    assignmentIndicator: {
                        select: {
                            indicator: { select: { code: true, description: true } },
                            assignment: { select: { dimension: { select: { code: true, title: true } } } },
                        },
                    },
                },
            }),
        ]);

        interface Aggregate {
            code: string;
            label: string;
            count: number;
            sumValue: number;
            sumEvaluation: number;
            evaluationCount: number;
        }

        const byIndicator = new Map<string, Aggregate>();
        const byDimension = new Map<string, Aggregate>();

        for (const response of responses) {
            const indicator = response.assignmentIndicator.indicator;
            const dimension = response.assignmentIndicator.assignment.dimension;

            for (const [map, code, label] of [
                [byIndicator, indicator.code, indicator.description],
                [byDimension, dimension.code, dimension.title],
            ] as const) {
                const entry = map.get(code) ?? { code, label, count: 0, sumValue: 0, sumEvaluation: 0, evaluationCount: 0 };
                entry.count += 1;
                entry.sumValue += response.valueAssigned;
                if (response.evaluationValue != null) {
                    entry.sumEvaluation += response.evaluationValue;
                    entry.evaluationCount += 1;
                }
                map.set(code, entry);
            }
        }

        const toSummary = (entry: Aggregate) => ({
            code: entry.code,
            label: entry.label,
            responses: entry.count,
            averageValue: entry.count ? Number((entry.sumValue / entry.count).toFixed(2)) : null,
            averageEvaluation: entry.evaluationCount ? Number((entry.sumEvaluation / entry.evaluationCount).toFixed(2)) : null,
        });

        const sortByCode = (a: { code: string }, b: { code: string }) => a.code.localeCompare(b.code, undefined, { numeric: true });

        return NextResponse.json({
            assignmentsByStatus: assignmentsByStatus.map((row) => ({ status: row.status, count: row._count })),
            usersByRole: usersByRole.map((row) => ({ role: row.role, count: row._count })),
            totalResponses: responses.length,
            indicators: [...byIndicator.values()].map(toSummary).sort(sortByCode),
            dimensions: [...byDimension.values()].map(toSummary).sort(sortByCode),
        });

    } catch (error: any) {
        console.error("Error at building dashboard:", error);
        return NextResponse.json({
            error: "Error interno del servidor",
            details: error.message,
        }, { status: 500 });
    }
}
