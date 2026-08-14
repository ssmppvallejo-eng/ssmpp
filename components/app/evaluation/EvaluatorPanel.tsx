"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiBookOpen, FiCheck, FiCheckCircle, FiFileText, FiMessageSquare } from "react-icons/fi";
import Spinner from "../Spinner";

interface ReviewDescriptor {
    id: number;
    title: string;
    description: string;
    value: number;
}

interface ReviewResponse {
    descriptorId: number;
    valueAssigned: number;
    comment?: string | null;
    evaluationValue?: number | null;
    note?: string | null;
    evidenceName?: string | null;
    evidenceUrl?: string | null;
    complete: boolean;
}

interface ReviewIndicator {
    id: number;
    assignmentIndicatorId: number;
    code: string;
    description: string;
    justification?: string | null;
    descriptors: ReviewDescriptor[];
    response: ReviewResponse | null;
}

interface ReviewJudgement {
    id: number;
    code: string;
    title: string;
    description?: string | null;
    indicators: ReviewIndicator[];
}

interface ReviewAssignment {
    id: number;
    status: string;
    dimension: { code: string; title: string; description?: string | null };
    progress: { total: number; answered: number };
    judgements: ReviewJudgement[];
}

interface JudgementDraft {
    evaluationValue: number | null;
    note: string;
    saved: boolean;
    saving: boolean;
}

export default function EvaluatorPanel({ assignmentId }: { assignmentId: string }) {
    const router = useRouter();
    const [assignment, setAssignment] = useState<ReviewAssignment | null>(null);
    const [drafts, setDrafts] = useState<Record<number, JudgementDraft>>({});
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [completing, setCompleting] = useState(false);

    useEffect(() => {
        let cancelled = false;

        fetch(`/api/assignment/${assignmentId}/review`)
            .then((response) => {
                if (!response.ok) throw new Error("No se pudo obtener la evaluación");
                return response.json();
            })
            .then((data: ReviewAssignment) => {
                if (cancelled) return;
                setAssignment(data);

                const initialDrafts: Record<number, JudgementDraft> = {};
                data.judgements.forEach((judgement) => {
                    judgement.indicators.forEach((indicator) => {
                        initialDrafts[indicator.assignmentIndicatorId] = {
                            evaluationValue: indicator.response?.evaluationValue ?? null,
                            note: indicator.response?.note ?? "",
                            saved: indicator.response?.evaluationValue != null,
                            saving: false,
                        };
                    });
                });
                setDrafts(initialDrafts);
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

    const updateDraft = (id: number, changes: Partial<JudgementDraft>) => {
        setDrafts((current) => ({
            ...current,
            [id]: { ...current[id], ...changes, ...(changes.saving === undefined && { saved: false }) },
        }));
    };

    const saveJudgement = async (assignmentIndicatorId: number) => {
        const draft = drafts[assignmentIndicatorId];
        if (!draft || draft.evaluationValue == null || draft.saving) return;

        updateDraft(assignmentIndicatorId, { saving: true });
        setErrorMessage(null);

        try {
            const response = await fetch(`/api/assignment/${assignmentId}/judgement`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    assignmentIndicatorId,
                    evaluationValue: draft.evaluationValue,
                    note: draft.note || null,
                }),
            });

            if (!response.ok) {
                const body = await response.json().catch(() => null);
                throw new Error(body?.message ?? "No se pudo guardar el juicio de valor");
            }

            setDrafts((current) => ({
                ...current,
                [assignmentIndicatorId]: { ...current[assignmentIndicatorId], saving: false, saved: true },
            }));
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Error inesperado");
            setDrafts((current) => ({
                ...current,
                [assignmentIndicatorId]: { ...current[assignmentIndicatorId], saving: false },
            }));
        }
    };

    const allJudged = Object.values(drafts).length > 0 && Object.values(drafts).every((draft) => draft.saved);

    const handleComplete = async () => {
        if (!allJudged || completing) return;
        setCompleting(true);
        setErrorMessage(null);

        try {
            const response = await fetch(`/api/assignment/${assignmentId}/complete`, { method: "POST" });
            if (!response.ok) {
                const body = await response.json().catch(() => null);
                throw new Error(body?.message ?? "No se pudo completar la revisión");
            }
            router.push("/app");
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Error inesperado");
            setCompleting(false);
        }
    };

    if (loading) {
        return (
            <div className="mx-auto w-full max-w-6xl px-5 py-6 sm:px-8 lg:px-10">
                <Spinner label="Cargando evaluación…" className="min-h-48 justify-center" />
            </div>
        );
    }

    if (!assignment) {
        return (
            <div className="mx-auto w-full max-w-6xl px-5 py-6 sm:px-8 lg:px-10">
                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                    {errorMessage ?? "Evaluación no encontrada"}
                </div>
            </div>
        );
    }

    const readOnly = assignment.status !== "EN_REVISION";

    return (
        <div className="mx-auto w-full max-w-6xl px-5 py-6 sm:px-8 lg:px-10">
            <Link href="/app" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-sky-800">
                <FiArrowLeft />
                Volver a actividades
            </Link>

            <header className="mb-8 mt-4 border-b border-zinc-200 pb-6">
                <p className="text-sm font-semibold uppercase text-violet-700">Evaluación en revisión</p>
                <h1 className="mt-2 text-3xl font-semibold leading-tight text-zinc-950">
                    {assignment.dimension.code} · {assignment.dimension.title}
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-600">
                    Revisa la respuesta de cada indicador y emite tu juicio de valor numérico (1–3) y textual.
                </p>
                {readOnly && (
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                        <p className="inline-flex rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800">
                            Esta evaluación ya fue completada; los juicios se muestran en modo lectura.
                        </p>
                        <Link
                            href={`/app/admin/assignments/${assignmentId}/report`}
                            className="inline-flex h-10 items-center rounded-md border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-700 transition hover:border-sky-700 hover:text-sky-800"
                        >
                            Ver reporte de evaluación
                        </Link>
                    </div>
                )}
            </header>

            {errorMessage && (
                <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                    {errorMessage}
                </div>
            )}

            <div className="flex flex-col gap-6">
                {assignment.judgements.map((judgement) => (
                    <section key={judgement.id} className="rounded-md border border-zinc-200 bg-white">
                        <article className="border-b border-zinc-200 px-5 py-5">
                            <p className="text-sm font-semibold uppercase text-sky-700">Criterio de evaluación</p>
                            <h2 className="mt-2 text-xl font-semibold leading-7 text-zinc-950">
                                {judgement.code}. {judgement.title}
                            </h2>
                        </article>

                        <div className="divide-y divide-zinc-100">
                            {judgement.indicators.map((indicator) => {
                                const selected = indicator.response
                                    ? indicator.descriptors.find((d) => d.id === indicator.response?.descriptorId)
                                    : null;
                                const draft = drafts[indicator.assignmentIndicatorId];

                                return (
                                    <article key={indicator.assignmentIndicatorId} className="px-5 py-6">
                                        <span className="inline-flex rounded-md bg-sky-50 px-3 py-1.5 text-sm font-semibold text-sky-800">
                                            Indicador {indicator.code}
                                        </span>
                                        <p className="mt-3 max-w-4xl text-base leading-7 text-zinc-800">
                                            {indicator.description}
                                        </p>
                                        {indicator.justification && (
                                            <p className="mt-2 inline-flex items-start gap-2 text-xs leading-5 text-zinc-500">
                                                <FiBookOpen className="mt-0.5 size-3.5 shrink-0 text-zinc-400" />
                                                Justificación normativa: {indicator.justification}
                                            </p>
                                        )}

                                        <div className="mt-4 rounded-md border border-sky-200 bg-sky-50/60 p-4">
                                            <p className="text-xs font-semibold uppercase text-sky-700">Respuesta del evaluado</p>
                                            {selected ? (
                                                <>
                                                    <p className="mt-2 text-sm font-semibold text-zinc-950">
                                                        {selected.title} (valor {selected.value})
                                                    </p>
                                                    <p className="mt-1 text-sm leading-6 text-zinc-700">{selected.description}</p>
                                                </>
                                            ) : (
                                                <p className="mt-2 text-sm text-zinc-500">Sin respuesta registrada.</p>
                                            )}

                                            {indicator.response?.comment && (
                                                <p className="mt-3 inline-flex items-start gap-2 text-sm leading-6 text-zinc-700">
                                                    <FiMessageSquare className="mt-1 size-4 shrink-0 text-sky-700" />
                                                    {indicator.response.comment}
                                                </p>
                                            )}
                                            {indicator.response?.evidenceUrl && (
                                                <a
                                                    href={indicator.response.evidenceUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-sky-800 underline"
                                                >
                                                    <FiFileText className="size-4" />
                                                    {indicator.response.evidenceName ?? "Ver evidencia"}
                                                </a>
                                            )}
                                        </div>

                                        <div className="mt-4 rounded-md border border-violet-200 bg-violet-50/50 p-4">
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <p className="text-xs font-semibold uppercase text-violet-700">Juicio de valor</p>
                                                {draft?.saved && (
                                                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                                                        <FiCheckCircle className="size-3.5" />
                                                        Guardado
                                                    </span>
                                                )}
                                            </div>

                                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                                {[1, 2, 3].map((value) => (
                                                    <button
                                                        key={value}
                                                        type="button"
                                                        disabled={readOnly}
                                                        onClick={() => updateDraft(indicator.assignmentIndicatorId, { evaluationValue: value })}
                                                        className={`grid size-10 place-items-center rounded-md border text-sm font-semibold transition disabled:cursor-not-allowed ${
                                                            draft?.evaluationValue === value
                                                                ? "border-violet-700 bg-violet-700 text-white"
                                                                : "border-zinc-300 bg-white text-zinc-700 hover:border-violet-400"
                                                        }`}
                                                    >
                                                        {value}
                                                    </button>
                                                ))}
                                                <span className="ml-1 text-xs text-zinc-500">1 = No logrado · 2 = En proceso · 3 = Plenamente logrado</span>
                                            </div>

                                            <textarea
                                                rows={3}
                                                disabled={readOnly}
                                                value={draft?.note ?? ""}
                                                onChange={(event) => updateDraft(indicator.assignmentIndicatorId, { note: event.target.value })}
                                                placeholder="Juicio de valor textual (observaciones, fundamentación, recomendaciones)"
                                                className="mt-3 w-full resize-y rounded-md border border-zinc-300 bg-white p-3 text-sm leading-6 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-violet-700 focus:ring-2 focus:ring-violet-100 disabled:bg-zinc-50 disabled:text-zinc-500"
                                            />

                                            {!readOnly && (
                                                <button
                                                    type="button"
                                                    disabled={draft?.evaluationValue == null || draft?.saving}
                                                    onClick={() => saveJudgement(indicator.assignmentIndicatorId)}
                                                    className="mt-3 inline-flex h-10 items-center gap-2 rounded-md bg-violet-700 px-4 text-sm font-semibold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    <FiCheck className="size-4" />
                                                    {draft?.saving ? "Guardando..." : "Guardar juicio"}
                                                </button>
                                            )}
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </section>
                ))}
            </div>

            {!readOnly && (
                <footer className="mt-8 flex flex-col gap-3 border-t border-zinc-200 pt-6 sm:flex-row sm:items-center sm:justify-end">
                    {!allJudged && (
                        <p className="text-sm text-zinc-500 sm:mr-auto">
                            Guarda el juicio de valor de todos los indicadores para completar la revisión.
                        </p>
                    )}
                    <button
                        type="button"
                        disabled={!allJudged || completing}
                        onClick={handleComplete}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
                    >
                        <FiCheckCircle className="size-4" />
                        {completing ? "Completando..." : "Completar revisión"}
                    </button>
                </footer>
            )}
        </div>
    );
}
