"use client";

import { useEffect, useState } from "react";

interface Summary {
    code: string;
    label: string;
    responses: number;
    averageValue: number | null;
    averageEvaluation: number | null;
}

interface DashboardData {
    assignmentsByStatus: { status: string; count: number }[];
    usersByRole: { role: string; count: number }[];
    totalResponses: number;
    indicators: Summary[];
    dimensions: Summary[];
}

const STATUS_LABELS: Record<string, string> = {
    PENDIENTE: "Pendiente",
    EN_PROCESO: "En proceso",
    ENVIADO: "Enviado",
    EN_REVISION: "En revisión",
    COMPLETADO: "Completado",
    NO_COMPLETADO: "No completado",
};

const STATUS_COLORS: Record<string, string> = {
    PENDIENTE: "bg-zinc-400",
    EN_PROCESO: "bg-amber-500",
    ENVIADO: "bg-sky-600",
    EN_REVISION: "bg-violet-600",
    COMPLETADO: "bg-emerald-600",
    NO_COMPLETADO: "bg-red-500",
};

function barColor(average: number) {
    if (average < 1.67) return "bg-red-500";
    if (average < 2.34) return "bg-amber-500";
    return "bg-emerald-600";
}

function ScoreBar({ average }: { average: number | null }) {
    if (average == null) return <span className="text-xs text-zinc-400">—</span>;
    const percent = Math.round((average / 3) * 100);
    return (
        <div className="flex items-center gap-2">
            <div className="h-2.5 w-full max-w-48 overflow-hidden rounded-full bg-zinc-100">
                <div className={`h-full rounded-full ${barColor(average)}`} style={{ width: `${percent}%` }} />
            </div>
            <span className="w-10 shrink-0 text-xs font-semibold text-zinc-700">{average.toFixed(2)}</span>
        </div>
    );
}

export default function DashboardManager() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        fetch("/api/dashboard")
            .then((response) => {
                if (!response.ok) throw new Error("No se pudo obtener el dashboard");
                return response.json();
            })
            .then((payload: DashboardData) => {
                if (!cancelled) setData(payload);
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

    if (loading) {
        return (
            <div className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
                <p className="text-sm text-zinc-500">Cargando dashboard...</p>
            </div>
        );
    }

    if (errorMessage || !data) {
        return (
            <div className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                    {errorMessage ?? "Sin datos"}
                </div>
            </div>
        );
    }

    const totalAssignments = data.assignmentsByStatus.reduce((sum, row) => sum + row.count, 0);

    return (
        <div className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
            <header className="mb-8 border-b border-zinc-200 pb-6">
                <p className="text-sm font-semibold uppercase text-sky-700">Administración</p>
                <h1 className="mt-2 text-3xl font-semibold leading-tight text-zinc-950 sm:text-4xl">
                    Dashboard
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
                    Resultados agregados de todas las evaluaciones: promedio de logro por dimensión e indicador
                    (escala 1–3), estado de las asignaciones y usuarios por rol.
                </p>
            </header>

            <div className="grid gap-6 lg:grid-cols-2">
                <section className="rounded-md border border-zinc-200 bg-white p-5">
                    <h2 className="text-sm font-semibold uppercase text-zinc-500">
                        Asignaciones por estado ({totalAssignments})
                    </h2>
                    <div className="mt-4 flex flex-col gap-3">
                        {data.assignmentsByStatus.length === 0 && (
                            <p className="text-sm text-zinc-500">Sin asignaciones registradas.</p>
                        )}
                        {data.assignmentsByStatus.map((row) => (
                            <div key={row.status} className="flex items-center gap-3">
                                <span className="w-28 shrink-0 text-xs font-semibold text-zinc-600">
                                    {STATUS_LABELS[row.status] ?? row.status}
                                </span>
                                <div className="h-4 w-full overflow-hidden rounded bg-zinc-100">
                                    <div
                                        className={`h-full rounded ${STATUS_COLORS[row.status] ?? "bg-zinc-400"}`}
                                        style={{ width: `${totalAssignments ? Math.max(4, Math.round((row.count / totalAssignments) * 100)) : 0}%` }}
                                    />
                                </div>
                                <span className="w-6 shrink-0 text-right text-sm font-semibold text-zinc-950">{row.count}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="rounded-md border border-zinc-200 bg-white p-5">
                    <h2 className="text-sm font-semibold uppercase text-zinc-500">Usuarios aprobados por rol</h2>
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {data.usersByRole.map((row) => (
                            <div key={row.role} className="rounded-md border border-zinc-200 p-3 text-center">
                                <p className="text-2xl font-semibold text-zinc-950">{row.count}</p>
                                <p className="mt-1 text-xs font-semibold uppercase text-zinc-500">{row.role}</p>
                            </div>
                        ))}
                    </div>
                    <p className="mt-4 text-xs text-zinc-500">
                        Respuestas de indicadores registradas en el sistema: <span className="font-semibold text-zinc-800">{data.totalResponses}</span>
                    </p>
                </section>
            </div>

            <section className="mt-6 rounded-md border border-zinc-200 bg-white p-5">
                <h2 className="text-sm font-semibold uppercase text-zinc-500">Logro promedio por dimensión</h2>
                <div className="mt-4 flex flex-col gap-3">
                    {data.dimensions.length === 0 && (
                        <p className="text-sm text-zinc-500">Aún no hay respuestas registradas.</p>
                    )}
                    {data.dimensions.map((dimension) => (
                        <div key={dimension.code} className="grid items-center gap-2 sm:grid-cols-[minmax(0,1fr)_240px_240px]">
                            <p className="truncate text-sm text-zinc-800">
                                <span className="font-semibold text-sky-700">{dimension.code}</span> · {dimension.label}
                                <span className="ml-2 text-xs text-zinc-400">({dimension.responses} resp.)</span>
                            </p>
                            <div>
                                <p className="text-[10px] font-semibold uppercase text-zinc-400">Autoevaluación</p>
                                <ScoreBar average={dimension.averageValue} />
                            </div>
                            <div>
                                <p className="text-[10px] font-semibold uppercase text-zinc-400">Juicio del evaluador</p>
                                <ScoreBar average={dimension.averageEvaluation} />
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mt-6 rounded-md border border-zinc-200 bg-white p-5">
                <h2 className="text-sm font-semibold uppercase text-zinc-500">Logro promedio por indicador</h2>
                <div className="mt-4 flex flex-col gap-2.5">
                    {data.indicators.length === 0 && (
                        <p className="text-sm text-zinc-500">Aún no hay respuestas registradas.</p>
                    )}
                    {data.indicators.map((indicator) => (
                        <div key={indicator.code} className="grid items-center gap-2 border-b border-zinc-100 pb-2.5 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_240px_240px]">
                            <p className="truncate text-sm text-zinc-800" title={indicator.label}>
                                <span className="font-semibold text-sky-700">{indicator.code}</span>
                                <span className="ml-2 text-xs text-zinc-500">{indicator.label}</span>
                            </p>
                            <ScoreBar average={indicator.averageValue} />
                            <ScoreBar average={indicator.averageEvaluation} />
                        </div>
                    ))}
                </div>
                <p className="mt-4 text-xs text-zinc-500">
                    Escala: 1 = No logrado (rojo) · 2 = En proceso (ámbar) · 3 = Plenamente logrado (verde).
                    Columna izquierda: autoevaluación; derecha: juicio del evaluador.
                </p>
            </section>
        </div>
    );
}
