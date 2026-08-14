"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FiArrowLeft, FiBookOpen, FiCheckCircle, FiEdit2, FiFileText, FiMessageSquare, FiPrinter, FiTrash2, FiUser, FiUserPlus, FiX } from "react-icons/fi";
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
    requiresComment?: boolean;
    requiresEvidence?: boolean;
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
    assignmentDate?: string | null;
    submissionDate?: string | null;
    submittedAt?: string | null;
    dimension: { code: string; title: string; description?: string | null };
    owner: { name?: string | null; email: string };
    assignedUsers: { id: number; name?: string | null; email: string }[];
    progress: { total: number; answered: number };
    judgements: ReviewJudgement[];
}

const STATUS_STYLES: Record<string, string> = {
    PENDIENTE: "bg-zinc-100 text-zinc-700 border-zinc-200",
    EN_PROCESO: "bg-amber-50 text-amber-800 border-amber-200",
    ENVIADO: "bg-sky-50 text-sky-800 border-sky-200",
    EN_REVISION: "bg-violet-50 text-violet-800 border-violet-200",
    COMPLETADO: "bg-emerald-50 text-emerald-800 border-emerald-200",
    NO_COMPLETADO: "bg-red-50 text-red-800 border-red-200",
};

function formatDate(value?: string | null) {
    if (!value) return "—";
    return new Date(value).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
}

interface AdminUser {
    id: number;
    email: string;
    name?: string | null;
    role: string;
    accessStatus: string;
    postgraduates?: { postgraduate: { id: number; title: string } }[];
}

export default function AssignmentReview({ assignmentId }: { assignmentId: string }) {
    const router = useRouter();
    const { data: session } = useSession();
    const isAdmin = session?.user.role === "ADMINISTRADOR";

    const [assignment, setAssignment] = useState<ReviewAssignment | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const [allUsers, setAllUsers] = useState<AdminUser[]>([]);
    const [selectedEvaluator, setSelectedEvaluator] = useState<number | "">("");
    const [assigning, setAssigning] = useState(false);

    const [editOpen, setEditOpen] = useState(false);
    const [editDate, setEditDate] = useState("");
    const [editUserIds, setEditUserIds] = useState<Set<number>>(new Set());
    const [savingEdit, setSavingEdit] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        let cancelled = false;

        fetch(`/api/assignment/${assignmentId}/review`)
            .then((response) => {
                if (!response.ok) throw new Error("No se pudo obtener el detalle de la asignación");
                return response.json();
            })
            .then((data: ReviewAssignment) => {
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
    }, [assignmentId, refreshKey]);

    useEffect(() => {
        if (!isAdmin) return;
        let cancelled = false;

        fetch("/api/users")
            .then((response) => {
                if (!response.ok) throw new Error("No se pudieron obtener los usuarios");
                return response.json();
            })
            .then((data: AdminUser[]) => {
                if (cancelled) return;
                setAllUsers(data);
            })
            .catch(() => {
                // Las secciones administrativas simplemente no se muestran si falla.
            });

        return () => {
            cancelled = true;
        };
    }, [isAdmin]);

    const evaluators = allUsers.filter((user) => user.role === "EVALUADOR" && user.accessStatus === "APROBADO");
    const approvedUsers = allUsers.filter((user) => user.accessStatus === "APROBADO");

    // Posgrados de los responsables actuales, para sugerir evaluadores del
    // mismo programa (SRS: asignar evaluadores por programa).
    const assignedUserIds = new Set(assignment?.assignedUsers.map((user) => user.id) ?? []);
    const programIds = new Set(
        allUsers
            .filter((user) => assignedUserIds.has(user.id))
            .flatMap((user) => (user.postgraduates ?? []).map((entry) => entry.postgraduate.id))
    );

    const availableEvaluators = evaluators.filter((evaluator) => !assignedUserIds.has(evaluator.id));
    const sameProgramEvaluators = availableEvaluators.filter((evaluator) =>
        (evaluator.postgraduates ?? []).some((entry) => programIds.has(entry.postgraduate.id))
    );
    const otherEvaluators = availableEvaluators.filter((evaluator) => !sameProgramEvaluators.includes(evaluator));

    const openEdit = () => {
        if (!assignment) return;
        setEditDate(assignment.submissionDate ? assignment.submissionDate.slice(0, 10) : "");
        setEditUserIds(new Set(assignment.assignedUsers.map((user) => user.id)));
        setEditOpen(true);
    };

    const toggleEditUser = (id: number) => {
        setEditUserIds((current) => {
            const next = new Set(current);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const saveEdit = async () => {
        if (savingEdit || editUserIds.size === 0) return;
        setSavingEdit(true);
        setErrorMessage(null);

        try {
            const response = await fetch(`/api/assignment/${assignmentId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...(editDate && { dueDate: editDate }),
                    userIds: [...editUserIds],
                }),
            });

            if (!response.ok) {
                const body = await response.json().catch(() => null);
                throw new Error(body?.message ?? "No se pudo actualizar la asignación");
            }

            setEditOpen(false);
            setRefreshKey((key) => key + 1);
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Error inesperado");
        } finally {
            setSavingEdit(false);
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "¿Eliminar esta asignación? Se borrarán también las respuestas, juicios y evidencias capturadas. Esta acción no se puede deshacer."
        );
        if (!confirmed || deleting) return;

        setDeleting(true);
        setErrorMessage(null);

        try {
            const response = await fetch(`/api/assignment/${assignmentId}`, { method: "DELETE" });
            if (!response.ok) {
                const body = await response.json().catch(() => null);
                throw new Error(body?.message ?? "No se pudo eliminar la asignación");
            }
            router.push("/app/admin/assignments");
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Error inesperado");
            setDeleting(false);
        }
    };

    const assignEvaluator = async () => {
        if (selectedEvaluator === "" || assigning) return;
        setAssigning(true);
        setErrorMessage(null);

        try {
            const response = await fetch(`/api/assignment/${assignmentId}/evaluators`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: selectedEvaluator }),
            });

            if (!response.ok) {
                const body = await response.json().catch(() => null);
                throw new Error(body?.message ?? "No se pudo asignar el evaluador");
            }

            setSelectedEvaluator("");
            setRefreshKey((key) => key + 1);
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Error inesperado");
        } finally {
            setAssigning(false);
        }
    };

    if (loading) {
        return (
            <div className="mx-auto w-full max-w-6xl px-5 py-6 sm:px-8 lg:px-10">
                <Spinner label="Cargando detalle de asignación…" className="min-h-48 justify-center" />
            </div>
        );
    }

    if (errorMessage || !assignment) {
        return (
            <div className="mx-auto w-full max-w-6xl px-5 py-6 sm:px-8 lg:px-10">
                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                    {errorMessage ?? "Asignación no encontrada"}
                </div>
            </div>
        );
    }

    const progressPercent = assignment.progress.total === 0
        ? 0
        : Math.round((assignment.progress.answered / assignment.progress.total) * 100);

    return (
        <div className="mx-auto w-full max-w-6xl px-5 py-6 sm:px-8 lg:px-10">
            <Link
                href="/app/admin/assignments"
                className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-sky-800"
            >
                <FiArrowLeft />
                Volver a asignaciones
            </Link>

            <header className="mb-8 mt-4 border-b border-zinc-200 pb-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase text-sky-700">Revisión de asignación</p>
                        <h1 className="mt-2 text-3xl font-semibold leading-tight text-zinc-950">
                            {assignment.dimension.code} · {assignment.dimension.title}
                        </h1>
                        {assignment.dimension.description && (
                            <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-600">
                                {assignment.dimension.description}
                            </p>
                        )}
                    </div>
                    <div className="flex shrink-0 flex-wrap items-center gap-3">
                        <Link
                            href={`/app/admin/assignments/${assignmentId}/report`}
                            className="inline-flex h-10 items-center gap-2 rounded-md border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-700 transition hover:border-sky-700 hover:text-sky-800"
                        >
                            <FiPrinter className="size-4" />
                            Reporte
                        </Link>
                        {isAdmin && (
                            <>
                                <button
                                    type="button"
                                    onClick={openEdit}
                                    className="inline-flex h-10 items-center gap-2 rounded-md border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-700 transition hover:border-sky-700 hover:text-sky-800"
                                >
                                    <FiEdit2 className="size-4" />
                                    Editar
                                </button>
                                <button
                                    type="button"
                                    disabled={deleting}
                                    onClick={handleDelete}
                                    className="inline-flex h-10 items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <FiTrash2 className="size-4" />
                                    {deleting ? "Eliminando..." : "Eliminar"}
                                </button>
                            </>
                        )}
                        <span className={`inline-flex rounded-full border px-3 py-1.5 text-sm font-semibold ${STATUS_STYLES[assignment.status] ?? STATUS_STYLES.PENDIENTE}`}>
                            {assignment.status.replace("_", " ")}
                        </span>
                    </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <div className="rounded-md border border-zinc-200 bg-white px-4 py-3">
                        <p className="text-xs font-semibold uppercase text-zinc-500">Avance</p>
                        <p className="mt-1 text-lg font-semibold text-zinc-950">
                            {assignment.progress.answered} / {assignment.progress.total} indicadores
                        </p>
                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-100">
                            <div className="h-full rounded-full bg-sky-700" style={{ width: `${progressPercent}%` }} />
                        </div>
                    </div>
                    <div className="rounded-md border border-zinc-200 bg-white px-4 py-3">
                        <p className="text-xs font-semibold uppercase text-zinc-500">Asignada</p>
                        <p className="mt-1 text-lg font-semibold text-zinc-950">{formatDate(assignment.assignmentDate)}</p>
                    </div>
                    <div className="rounded-md border border-zinc-200 bg-white px-4 py-3">
                        <p className="text-xs font-semibold uppercase text-zinc-500">Vence</p>
                        <p className="mt-1 text-lg font-semibold text-zinc-950">{formatDate(assignment.submissionDate)}</p>
                    </div>
                    <div className="rounded-md border border-zinc-200 bg-white px-4 py-3">
                        <p className="text-xs font-semibold uppercase text-zinc-500">Enviada</p>
                        <p className="mt-1 text-lg font-semibold text-zinc-950">
                            {assignment.submittedAt ? formatDate(assignment.submittedAt) : <span className="text-zinc-400">—</span>}
                        </p>
                    </div>
                    <div className="rounded-md border border-zinc-200 bg-white px-4 py-3">
                        <p className="text-xs font-semibold uppercase text-zinc-500">Responsables</p>
                        <div className="mt-1 flex flex-col gap-0.5">
                            {assignment.assignedUsers.map((user) => (
                                <span key={user.id} className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-800">
                                    <FiUser className="size-3.5 text-zinc-400" />
                                    {user.name ?? user.email}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {isAdmin && (assignment.status === "ENVIADO" || assignment.status === "EN_REVISION") && (
                    <div className="mt-6 rounded-md border border-violet-200 bg-violet-50/50 p-4">
                        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-violet-700">
                            <FiUserPlus className="size-4" />
                            Asignar evaluador
                        </p>
                        <p className="mt-1 text-sm text-zinc-600">
                            Al asignar un evaluador, la evaluación pasa a revisión y el evaluador podrá emitir juicios de valor por indicador.
                        </p>
                        {evaluators.length === 0 ? (
                            <p className="mt-3 text-sm text-zinc-500">
                                No hay usuarios aprobados con rol EVALUADOR. Asigna el rol desde el panel de usuarios.
                            </p>
                        ) : (
                            <div className="mt-3 flex flex-wrap items-center gap-3">
                                <select
                                    value={selectedEvaluator}
                                    onChange={(event) => setSelectedEvaluator(event.target.value === "" ? "" : Number(event.target.value))}
                                    className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900"
                                >
                                    <option value="">Selecciona un evaluador...</option>
                                    {sameProgramEvaluators.length > 0 && (
                                        <optgroup label="Del mismo posgrado que los responsables">
                                            {sameProgramEvaluators.map((evaluator) => (
                                                <option key={evaluator.id} value={evaluator.id}>
                                                    {evaluator.name ?? evaluator.email}
                                                </option>
                                            ))}
                                        </optgroup>
                                    )}
                                    {otherEvaluators.length > 0 && (
                                        <optgroup label={sameProgramEvaluators.length > 0 ? "Otros evaluadores" : "Evaluadores"}>
                                            {otherEvaluators.map((evaluator) => (
                                                <option key={evaluator.id} value={evaluator.id}>
                                                    {evaluator.name ?? evaluator.email}
                                                </option>
                                            ))}
                                        </optgroup>
                                    )}
                                </select>
                                <button
                                    type="button"
                                    disabled={selectedEvaluator === "" || assigning}
                                    onClick={assignEvaluator}
                                    className="inline-flex h-10 items-center gap-2 rounded-md bg-violet-700 px-4 text-sm font-semibold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <FiUserPlus className="size-4" />
                                    {assigning ? "Asignando..." : "Asignar"}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </header>

            <div className="flex flex-col gap-6">
                {assignment.judgements.map((judgement) => (
                    <section key={judgement.id} className="rounded-md border border-zinc-200 bg-white">
                        <article className="border-b border-zinc-200 px-5 py-5">
                            <p className="text-sm font-semibold uppercase text-sky-700">Criterio de evaluación</p>
                            <h2 className="mt-2 text-xl font-semibold leading-7 text-zinc-950">
                                {judgement.code}. {judgement.title}
                            </h2>
                            {judgement.description && (
                                <p className="mt-3 max-w-4xl text-sm leading-6 text-zinc-600">{judgement.description}</p>
                            )}
                        </article>

                        <div className="divide-y divide-zinc-100">
                            {judgement.indicators.map((indicator) => {
                                const selected = indicator.response
                                    ? indicator.descriptors.find((d) => d.id === indicator.response?.descriptorId)
                                    : null;

                                return (
                                    <article key={indicator.assignmentIndicatorId} className="px-5 py-6">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="inline-flex rounded-md bg-sky-50 px-3 py-1.5 text-sm font-semibold text-sky-800">
                                                Indicador {indicator.code}
                                            </span>
                                            {indicator.response?.complete ? (
                                                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                                                    <FiCheckCircle className="size-3.5" />
                                                    Respondido
                                                </span>
                                            ) : (
                                                <span className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-semibold text-zinc-500">
                                                    Sin respuesta
                                                </span>
                                            )}
                                            {indicator.requiresComment && (
                                                <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
                                                    Comentario obligatorio
                                                </span>
                                            )}
                                            {indicator.requiresEvidence && (
                                                <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
                                                    Evidencia obligatoria
                                                </span>
                                            )}
                                        </div>

                                        <p className="mt-3 max-w-4xl text-base leading-7 text-zinc-800">
                                            {indicator.description}
                                        </p>

                                        {indicator.justification && (
                                            <p className="mt-2 inline-flex items-start gap-2 text-xs leading-5 text-zinc-500">
                                                <FiBookOpen className="mt-0.5 size-3.5 shrink-0 text-zinc-400" />
                                                Justificación normativa: {indicator.justification}
                                            </p>
                                        )}

                                        <div className="mt-4 grid gap-3 md:grid-cols-3">
                                            {indicator.descriptors.map((descriptor) => {
                                                const isSelected = selected?.id === descriptor.id;
                                                return (
                                                    <div
                                                        key={descriptor.id}
                                                        className={`rounded-md border p-4 ${
                                                            isSelected
                                                                ? "border-sky-700 bg-sky-50 shadow-sm"
                                                                : "border-zinc-200 bg-white opacity-70"
                                                        }`}
                                                    >
                                                        <div className="flex items-start justify-between gap-3">
                                                            <p className="text-sm font-semibold leading-6 text-zinc-950">
                                                                {descriptor.title}
                                                            </p>
                                                            <span className={`grid size-6 shrink-0 place-items-center rounded-full border text-xs font-semibold ${
                                                                isSelected ? "border-sky-700 bg-sky-700 text-white" : "border-zinc-300 text-zinc-500"
                                                            }`}>
                                                                {descriptor.value}
                                                            </span>
                                                        </div>
                                                        <p className="mt-2 text-xs leading-5 text-zinc-600">{descriptor.description}</p>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {(indicator.response?.comment || indicator.response?.evidenceUrl) && (
                                            <div className="mt-4 grid gap-3 lg:grid-cols-2">
                                                {indicator.response?.comment && (
                                                    <div className="rounded-md border border-zinc-200 bg-stone-50 p-4">
                                                        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-zinc-500">
                                                            <FiMessageSquare className="size-3.5 text-sky-700" />
                                                            Comentario del evaluado
                                                        </p>
                                                        <p className="mt-2 text-sm leading-6 text-zinc-800">{indicator.response.comment}</p>
                                                    </div>
                                                )}
                                                {indicator.response?.evidenceUrl && (
                                                    <div className="rounded-md border border-zinc-200 bg-stone-50 p-4">
                                                        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase text-zinc-500">
                                                            <FiFileText className="size-3.5 text-sky-700" />
                                                            Evidencia
                                                        </p>
                                                        <a
                                                            href={indicator.response.evidenceUrl}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="mt-2 inline-block text-sm font-semibold text-sky-800 underline"
                                                        >
                                                            {indicator.response.evidenceName ?? "Ver archivo"}
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {(indicator.response?.evaluationValue != null || indicator.response?.note) && (
                                            <div className="mt-3 rounded-md border border-violet-200 bg-violet-50 p-4">
                                                <p className="text-xs font-semibold uppercase text-violet-700">Juicio de valor del evaluador</p>
                                                {indicator.response?.evaluationValue != null && (
                                                    <p className="mt-2 text-sm font-semibold text-zinc-900">
                                                        Valoración numérica: {indicator.response.evaluationValue}
                                                    </p>
                                                )}
                                                {indicator.response?.note && (
                                                    <p className="mt-1 text-sm leading-6 text-zinc-800">{indicator.response.note}</p>
                                                )}
                                            </div>
                                        )}
                                    </article>
                                );
                            })}
                        </div>
                    </section>
                ))}
            </div>

            {editOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 p-4">
                    <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-md border border-zinc-200 bg-white p-6 shadow-xl">
                        <div className="flex items-center justify-between gap-4">
                            <h2 className="text-lg font-semibold text-zinc-950">Editar asignación</h2>
                            <button type="button" onClick={() => setEditOpen(false)} className="text-zinc-400 transition hover:text-zinc-950">
                                <FiX className="size-5" />
                            </button>
                        </div>

                        <div className="mt-5 flex flex-col gap-4">
                            <label className="block">
                                <span className="text-sm font-semibold text-zinc-950">Fecha de vencimiento</span>
                                <input
                                    type="date"
                                    value={editDate}
                                    onChange={(event) => setEditDate(event.target.value)}
                                    className="mt-2 h-11 w-full rounded-md border border-zinc-300 px-3 text-sm text-zinc-900"
                                />
                            </label>

                            <div>
                                <p className="text-sm font-semibold text-zinc-950">
                                    Usuarios asignados ({editUserIds.size})
                                </p>
                                <div className="mt-2 flex max-h-60 flex-col gap-2 overflow-y-auto">
                                    {approvedUsers.map((user) => (
                                        <label
                                            key={user.id}
                                            className="flex cursor-pointer items-center gap-3 rounded-md border border-zinc-200 px-3 py-2 transition hover:border-sky-300"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={editUserIds.has(user.id)}
                                                onChange={() => toggleEditUser(user.id)}
                                                className="size-4 accent-sky-700"
                                            />
                                            <span className="min-w-0">
                                                <span className="block truncate text-sm font-semibold text-zinc-950">
                                                    {user.name ?? user.email}
                                                </span>
                                                <span className="block text-xs text-zinc-500">{user.role}</span>
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setEditOpen(false)}
                                className="inline-flex h-11 items-center rounded-md border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                disabled={savingEdit || editUserIds.size === 0}
                                onClick={saveEdit}
                                className="inline-flex h-11 items-center rounded-md bg-sky-700 px-5 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {savingEdit ? "Guardando..." : "Guardar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
