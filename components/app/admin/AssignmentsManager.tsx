"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";

interface AssignmentRow {
    id: number;
    status: string;
    assignmentDate?: string | null;
    submissionDate?: string | null;
    dimension: { code: string; title: string };
    owner: { name?: string | null; email: string };
    assignedUsers: { user: { id: number; name?: string | null; email: string } }[];
    _count: { indicators: number };
}

const STATUS_STYLES: Record<string, string> = {
    PENDIENTE: "bg-zinc-100 text-zinc-700 border-zinc-200",
    EN_PROCESO: "bg-amber-50 text-amber-800 border-amber-200",
    ENVIADO: "bg-sky-50 text-sky-800 border-sky-200",
    EN_REVISION: "bg-violet-50 text-violet-800 border-violet-200",
    COMPLETADO: "bg-emerald-50 text-emerald-800 border-emerald-200",
};

function formatDate(value?: string | null) {
    if (!value) return "—";
    return new Date(value).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
}

export default function AssignmentsManager() {
    const [assignments, setAssignments] = useState<AssignmentRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        fetch("/api/assignment")
            .then((response) => {
                if (!response.ok) throw new Error("No se pudieron obtener las asignaciones");
                return response.json();
            })
            .then((data: AssignmentRow[]) => {
                if (!cancelled) setAssignments(data);
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
    }, []);

    return (
        <div className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
            <header className="mb-8 flex flex-col gap-4 border-b border-zinc-200 pb-6 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase text-sky-700">Administración</p>
                    <h1 className="mt-2 text-3xl font-semibold leading-tight text-zinc-950 sm:text-4xl">
                        Asignaciones
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
                        Crea evaluaciones a partir de una dimensión, por plantilla o eligiendo indicadores, y asígnalas a uno o más usuarios.
                    </p>
                </div>
                <Link
                    href="/app/admin/assignments/new"
                    className="inline-flex h-11 items-center gap-2 rounded-md bg-sky-700 px-4 text-sm font-semibold text-white transition hover:bg-sky-800"
                >
                    <FiPlus className="size-4" />
                    Nueva asignación
                </Link>
            </header>

            {errorMessage && (
                <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                    {errorMessage}
                </div>
            )}

            {loading ? (
                <p className="text-sm text-zinc-500">Cargando asignaciones...</p>
            ) : assignments.length === 0 ? (
                <div className="border border-dashed border-zinc-300 bg-white px-6 py-12 text-center">
                    <p className="text-sm text-zinc-600">Todavía no hay asignaciones. Crea la primera con el botón de arriba.</p>
                </div>
            ) : (
                <div className="overflow-x-auto border border-zinc-200 bg-white">
                    <table className="w-full min-w-[760px] text-left text-sm">
                        <thead>
                            <tr className="border-b border-zinc-200 text-xs font-semibold uppercase text-zinc-500">
                                <th className="px-4 py-3">Evaluación</th>
                                <th className="px-4 py-3">Estado</th>
                                <th className="px-4 py-3">Indicadores</th>
                                <th className="px-4 py-3">Asignada</th>
                                <th className="px-4 py-3">Vence</th>
                                <th className="px-4 py-3">Usuarios</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assignments.map((assignment) => (
                                <tr key={assignment.id} className="border-b border-zinc-100 last:border-b-0">
                                    <td className="px-4 py-3">
                                        <p className="font-semibold text-zinc-950">
                                            {assignment.dimension.code} · {assignment.dimension.title}
                                        </p>
                                        <p className="text-xs text-zinc-500">
                                            Creada por {assignment.owner.name ?? assignment.owner.email}
                                        </p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[assignment.status] ?? STATUS_STYLES.PENDIENTE}`}>
                                            {assignment.status.replace("_", " ")}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-zinc-700">{assignment._count.indicators}</td>
                                    <td className="px-4 py-3 text-zinc-700">{formatDate(assignment.assignmentDate)}</td>
                                    <td className="px-4 py-3 text-zinc-700">{formatDate(assignment.submissionDate)}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-col gap-0.5">
                                            {assignment.assignedUsers.map(({ user }) => (
                                                <span key={user.id} className="text-xs text-zinc-600">
                                                    {user.name ?? user.email}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
