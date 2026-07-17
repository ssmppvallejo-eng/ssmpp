"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FiArrowLeft, FiPrinter } from "react-icons/fi";

interface ReportDescriptor {
    id: number;
    title: string;
    description: string;
    value: number;
}

interface ReportResponse {
    descriptorId: number;
    valueAssigned: number;
    comment?: string | null;
    evaluationValue?: number | null;
    note?: string | null;
    complete: boolean;
}

interface ReportIndicator {
    id: number;
    assignmentIndicatorId: number;
    code: string;
    description: string;
    justification?: string | null;
    descriptors: ReportDescriptor[];
    response: ReportResponse | null;
}

interface ReportJudgement {
    id: number;
    code: string;
    title: string;
    description?: string | null;
    indicators: ReportIndicator[];
}

interface ReportAssignment {
    id: number;
    status: string;
    assignmentDate?: string | null;
    submissionDate?: string | null;
    dimension: { code: string; title: string; description?: string | null };
    owner: { name?: string | null; email: string };
    assignedUsers: { id: number; name?: string | null; email: string }[];
    progress: { total: number; answered: number };
    judgements: ReportJudgement[];
}

const STATUS_LABELS: Record<string, string> = {
    PENDIENTE: "Pendiente",
    EN_PROCESO: "En proceso",
    ENVIADO: "Enviado",
    EN_REVISION: "En revisión",
    COMPLETADO: "Completado",
};

const ACHIEVEMENT_LABELS = ["No logrado", "En proceso", "Plenamente logrado"];

function formatDate(value?: string | null) {
    if (!value) return "—";
    return new Date(value).toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" });
}

function achievementLabel(average: number) {
    if (average < 1.67) return ACHIEVEMENT_LABELS[0];
    if (average < 2.34) return ACHIEVEMENT_LABELS[1];
    return ACHIEVEMENT_LABELS[2];
}

interface JudgementScore {
    judgement: ReportJudgement;
    answered: number;
    total: number;
    sumValue: number;
    maxValue: number;
    percent: number;
    judged: number;
    evaluationAverage: number | null;
}

export default function AssignmentReport({ assignmentId }: { assignmentId: string }) {
    const [assignment, setAssignment] = useState<ReportAssignment | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        fetch(`/api/assignment/${assignmentId}/review`)
            .then((response) => {
                if (!response.ok) throw new Error("No se pudo obtener la información del reporte");
                return response.json();
            })
            .then((data: ReportAssignment) => {
                if (!cancelled) setAssignment(data);
            })
            .catch((error) => {
                if (!cancelled) setErrorMessage(error instanceof Error ? error.message : "Error inesperado");
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [assignmentId]);

    const scores = useMemo<JudgementScore[]>(() => {
        if (!assignment) return [];

        return assignment.judgements.map((judgement) => {
            const answered = judgement.indicators.filter((indicator) => indicator.response?.complete);
            const judgedResponses = judgement.indicators
                .map((indicator) => indicator.response?.evaluationValue)
                .filter((value): value is number => value != null);

            const sumValue = answered.reduce((sum, indicator) => sum + (indicator.response?.valueAssigned ?? 0), 0);
            const maxValue = judgement.indicators.length * 3;

            return {
                judgement,
                answered: answered.length,
                total: judgement.indicators.length,
                sumValue,
                maxValue,
                percent: maxValue === 0 ? 0 : Math.round((sumValue / maxValue) * 100),
                judged: judgedResponses.length,
                evaluationAverage: judgedResponses.length
                    ? judgedResponses.reduce((sum, value) => sum + value, 0) / judgedResponses.length
                    : null,
            };
        });
    }, [assignment]);

    const totals = useMemo(() => {
        const sumValue = scores.reduce((sum, score) => sum + score.sumValue, 0);
        const maxValue = scores.reduce((sum, score) => sum + score.maxValue, 0);
        const answered = scores.reduce((sum, score) => sum + score.answered, 0);
        const total = scores.reduce((sum, score) => sum + score.total, 0);
        const judged = scores.reduce((sum, score) => sum + score.judged, 0);
        const judgementValues = scores
            .filter((score) => score.evaluationAverage != null)
            .map((score) => ({ avg: score.evaluationAverage as number, count: score.judged }));
        const judgementSum = judgementValues.reduce((sum, entry) => sum + entry.avg * entry.count, 0);

        return {
            sumValue,
            maxValue,
            answered,
            total,
            judged,
            percent: maxValue === 0 ? 0 : Math.round((sumValue / maxValue) * 100),
            responseAverage: answered === 0 ? null : sumValue / answered,
            evaluationAverage: judged === 0 ? null : judgementSum / judged,
        };
    }, [scores]);

    if (loading) {
        return (
            <div className="mx-auto w-full max-w-5xl px-5 py-6 sm:px-8">
                <p className="text-sm text-zinc-500">Generando reporte...</p>
            </div>
        );
    }

    if (errorMessage || !assignment) {
        return (
            <div className="mx-auto w-full max-w-5xl px-5 py-6 sm:px-8">
                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                    {errorMessage ?? "Asignación no encontrada"}
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-5xl px-5 py-6 sm:px-8 print:max-w-none print:px-0 print:py-0">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
                <Link
                    href={`/app/admin/assignments/${assignmentId}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-sky-800"
                >
                    <FiArrowLeft />
                    Volver al detalle
                </Link>
                <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex h-11 items-center gap-2 rounded-md bg-sky-700 px-5 text-sm font-semibold text-white transition hover:bg-sky-800"
                >
                    <FiPrinter className="size-4" />
                    Imprimir / Guardar como PDF
                </button>
            </div>

            <article className="border border-zinc-200 bg-white p-8 print:border-0 print:p-0">
                <header className="border-b-2 border-zinc-950 pb-6">
                    <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                        Sistema de Indicadores Contextualizados para Valorar la Pertinencia de los Programas de Posgrado de la BUAP (SICVPP-BUAP)
                    </p>
                    <h1 className="mt-3 text-2xl font-semibold text-zinc-950">
                        Reporte de evaluación · Dimensión {assignment.dimension.code}
                    </h1>
                    <p className="mt-1 text-lg text-zinc-700">{assignment.dimension.title}</p>
                    {assignment.dimension.description && (
                        <p className="mt-2 text-sm leading-6 text-zinc-600">{assignment.dimension.description}</p>
                    )}
                </header>

                <section className="mt-6 grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-3">
                    <div>
                        <p className="text-xs font-semibold uppercase text-zinc-500">Estado</p>
                        <p className="font-semibold text-zinc-950">{STATUS_LABELS[assignment.status] ?? assignment.status}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase text-zinc-500">Fecha de asignación</p>
                        <p className="text-zinc-800">{formatDate(assignment.assignmentDate)}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase text-zinc-500">Fecha límite</p>
                        <p className="text-zinc-800">{formatDate(assignment.submissionDate)}</p>
                    </div>
                    <div className="col-span-2 sm:col-span-2">
                        <p className="text-xs font-semibold uppercase text-zinc-500">Responsables</p>
                        <p className="text-zinc-800">
                            {assignment.assignedUsers.map((user) => user.name ?? user.email).join(", ")}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase text-zinc-500">Fecha del reporte</p>
                        <p className="text-zinc-800">{new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" })}</p>
                    </div>
                </section>

                <section className="mt-8 break-inside-avoid">
                    <h2 className="border-b border-zinc-300 pb-2 text-lg font-semibold text-zinc-950">
                        Resumen de resultados
                    </h2>

                    <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                        <div className="rounded-md border border-zinc-200 p-4">
                            <p className="text-2xl font-semibold text-zinc-950">
                                {totals.answered}/{totals.total}
                            </p>
                            <p className="mt-1 text-xs font-semibold uppercase text-zinc-500">Indicadores respondidos</p>
                        </div>
                        <div className="rounded-md border border-zinc-200 p-4">
                            <p className="text-2xl font-semibold text-zinc-950">
                                {totals.sumValue}/{totals.maxValue} <span className="text-base text-zinc-500">({totals.percent}%)</span>
                            </p>
                            <p className="mt-1 text-xs font-semibold uppercase text-zinc-500">Puntaje de logro (autoevaluación)</p>
                        </div>
                        <div className="rounded-md border border-zinc-200 p-4">
                            <p className="text-2xl font-semibold text-zinc-950">
                                {totals.evaluationAverage == null ? "—" : totals.evaluationAverage.toFixed(2)}
                            </p>
                            <p className="mt-1 text-xs font-semibold uppercase text-zinc-500">
                                Juicio del evaluador (promedio, {totals.judged}/{totals.total})
                            </p>
                        </div>
                    </div>

                    {totals.responseAverage != null && (
                        <p className="mt-3 text-sm leading-6 text-zinc-700">
                            Nivel de logro global según la autoevaluación:{" "}
                            <span className="font-semibold text-zinc-950">
                                {achievementLabel(totals.responseAverage)} ({totals.responseAverage.toFixed(2)} / 3.00)
                            </span>
                            {totals.evaluationAverage != null && (
                                <>
                                    {" · "}Según el juicio del evaluador:{" "}
                                    <span className="font-semibold text-zinc-950">
                                        {achievementLabel(totals.evaluationAverage)} ({totals.evaluationAverage.toFixed(2)} / 3.00)
                                    </span>
                                </>
                            )}
                        </p>
                    )}

                    <table className="mt-5 w-full border-collapse text-sm">
                        <thead>
                            <tr className="border-b-2 border-zinc-950 text-left text-xs font-semibold uppercase text-zinc-600">
                                <th className="py-2 pr-3">Criterio</th>
                                <th className="px-3 py-2 text-center">Respondidos</th>
                                <th className="px-3 py-2 text-center">Puntaje</th>
                                <th className="px-3 py-2 text-center">% Logro</th>
                                <th className="px-3 py-2 text-center">Juicio prom.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scores.map((score) => (
                                <tr key={score.judgement.id} className="border-b border-zinc-200">
                                    <td className="py-2 pr-3">
                                        <span className="font-semibold text-zinc-950">{score.judgement.code}</span>
                                        <span className="text-zinc-700"> · {score.judgement.title}</span>
                                    </td>
                                    <td className="px-3 py-2 text-center text-zinc-800">{score.answered}/{score.total}</td>
                                    <td className="px-3 py-2 text-center text-zinc-800">{score.sumValue}/{score.maxValue}</td>
                                    <td className="px-3 py-2 text-center font-semibold text-zinc-950">{score.percent}%</td>
                                    <td className="px-3 py-2 text-center text-zinc-800">
                                        {score.evaluationAverage == null ? "—" : score.evaluationAverage.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                {assignment.judgements.map((judgement) => (
                    <section key={judgement.id} className="mt-8 break-inside-avoid">
                        <h2 className="border-b border-zinc-300 pb-2 text-lg font-semibold text-zinc-950">
                            Criterio {judgement.code}. {judgement.title}
                        </h2>
                        {judgement.description && (
                            <p className="mt-2 text-sm leading-6 text-zinc-600">{judgement.description}</p>
                        )}

                        <div className="mt-4 flex flex-col gap-5">
                            {judgement.indicators.map((indicator) => {
                                const selected = indicator.response
                                    ? indicator.descriptors.find((descriptor) => descriptor.id === indicator.response?.descriptorId)
                                    : null;

                                return (
                                    <div key={indicator.assignmentIndicatorId} className="break-inside-avoid border-l-2 border-zinc-300 pl-4">
                                        <p className="text-sm leading-6 text-zinc-800">
                                            <span className="font-semibold text-zinc-950">{indicator.code}</span>
                                            {" — "}
                                            {indicator.description}
                                        </p>
                                        {indicator.justification && (
                                            <p className="mt-1 text-xs leading-5 text-zinc-500">
                                                Justificación normativa: {indicator.justification}
                                            </p>
                                        )}

                                        <div className="mt-2 grid gap-x-8 gap-y-1 text-sm sm:grid-cols-2">
                                            <p className="text-zinc-800">
                                                <span className="text-xs font-semibold uppercase text-zinc-500">Autoevaluación: </span>
                                                {selected
                                                    ? <span className="font-semibold">{selected.value} · {selected.title}</span>
                                                    : <span className="text-zinc-500">Sin respuesta</span>}
                                            </p>
                                            <p className="text-zinc-800">
                                                <span className="text-xs font-semibold uppercase text-zinc-500">Juicio del evaluador: </span>
                                                {indicator.response?.evaluationValue != null
                                                    ? <span className="font-semibold">
                                                        {indicator.response.evaluationValue} · {ACHIEVEMENT_LABELS[indicator.response.evaluationValue - 1]}
                                                    </span>
                                                    : <span className="text-zinc-500">Pendiente</span>}
                                            </p>
                                        </div>

                                        {indicator.response?.comment && (
                                            <p className="mt-1.5 text-sm leading-6 text-zinc-700">
                                                <span className="text-xs font-semibold uppercase text-zinc-500">Comentario del evaluado: </span>
                                                {indicator.response.comment}
                                            </p>
                                        )}
                                        {indicator.response?.note && (
                                            <p className="mt-1.5 text-sm leading-6 text-zinc-700">
                                                <span className="text-xs font-semibold uppercase text-zinc-500">Observaciones del evaluador: </span>
                                                {indicator.response.note}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                ))}

                <footer className="mt-10 border-t border-zinc-300 pt-4 text-xs leading-5 text-zinc-500">
                    <p>
                        Reporte generado por el SICVPP-BUAP. Escala de descriptores de logro: 1 = No logrado, 2 = En proceso,
                        3 = Plenamente logrado. El puntaje de logro corresponde a la autoevaluación del programa; el juicio de
                        valor corresponde a la revisión del evaluador.
                    </p>
                </footer>
            </article>
        </div>
    );
}
