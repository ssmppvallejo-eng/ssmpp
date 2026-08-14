"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiArrowLeft, FiChevronDown, FiChevronRight } from "react-icons/fi";
import Spinner from "../Spinner";

interface LogEntry {
    id: number;
    entityType: string;
    entityId: number;
    entityCode?: string | null;
    action: "CREATE" | "UPDATE" | "DELETE";
    changes?: Record<string, unknown> | null;
    userEmail?: string | null;
    createdAt: string;
}

interface HistoryResponse {
    entries: LogEntry[];
    total: number;
    page: number;
    totalPages: number;
}

const ENTITY_LABELS: Record<string, string> = {
    DIMENSION: "Dimensión",
    COMPONENT: "Componente",
    JUDGEMENT: "Criterio",
    INDICATOR: "Indicador",
    DESCRIPTOR: "Descriptor",
};

const ACTION_STYLES: Record<string, string> = {
    CREATE: "bg-emerald-50 text-emerald-800 border-emerald-200",
    UPDATE: "bg-amber-50 text-amber-800 border-amber-200",
    DELETE: "bg-red-50 text-red-800 border-red-200",
};

const ACTION_LABELS: Record<string, string> = {
    CREATE: "Creado",
    UPDATE: "Editado",
    DELETE: "Eliminado",
};

function formatDateTime(value: string) {
    return new Date(value).toLocaleString("es-MX", {
        day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
}

export default function InstrumentHistory() {
    const [data, setData] = useState<HistoryResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [entityFilter, setEntityFilter] = useState("");
    const [actionFilter, setActionFilter] = useState("");
    const [page, setPage] = useState(1);
    const [expanded, setExpanded] = useState<Set<number>>(new Set());

    useEffect(() => {
        let cancelled = false;

        const params = new URLSearchParams();
        if (entityFilter) params.set("entityType", entityFilter);
        if (actionFilter) params.set("action", actionFilter);
        params.set("page", String(page));

        fetch(`/api/instrument/history?${params.toString()}`)
            .then((response) => {
                if (!response.ok) throw new Error("No se pudo obtener el historial");
                return response.json();
            })
            .then((payload: HistoryResponse) => {
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
    }, [entityFilter, actionFilter, page]);

    const toggle = (id: number) => {
        setExpanded((current) => {
            const next = new Set(current);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    return (
        <div className="mx-auto w-full max-w-5xl px-5 py-6 sm:px-8 lg:px-10">
            <Link
                href="/app/admin/instrument"
                className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-sky-800"
            >
                <FiArrowLeft />
                Volver al instrumento
            </Link>

            <header className="mb-6 mt-4 border-b border-zinc-200 pb-6">
                <p className="text-sm font-semibold uppercase text-sky-700">Administración</p>
                <h1 className="mt-2 text-3xl font-semibold leading-tight text-zinc-950 sm:text-4xl">
                    Historial de edición
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
                    Bitácora de altas, ediciones y eliminaciones sobre dimensiones, componentes, criterios,
                    indicadores y descriptores del instrumento.
                </p>
            </header>

            <div className="mb-5 flex flex-wrap items-center gap-3">
                <select
                    value={entityFilter}
                    onChange={(event) => { setEntityFilter(event.target.value); setPage(1); }}
                    className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-700"
                >
                    <option value="">Todos los niveles</option>
                    {Object.entries(ENTITY_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>
                <select
                    value={actionFilter}
                    onChange={(event) => { setActionFilter(event.target.value); setPage(1); }}
                    className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-700"
                >
                    <option value="">Todas las acciones</option>
                    {Object.entries(ACTION_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>
                {data && <p className="text-xs text-zinc-500">{data.total} registros</p>}
            </div>

            {errorMessage && (
                <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                    {errorMessage}
                </div>
            )}

            {loading ? (
                <Spinner label="Cargando historial…" className="min-h-48 justify-center" />
            ) : !data || data.entries.length === 0 ? (
                <div className="border border-dashed border-zinc-300 bg-white px-6 py-12 text-center">
                    <p className="text-sm text-zinc-600">Sin registros todavía.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {data.entries.map((entry) => {
                        const isOpen = expanded.has(entry.id);
                        const hasChanges = entry.changes && Object.keys(entry.changes).length > 0;

                        return (
                            <div key={entry.id} className="border border-zinc-200 bg-white">
                                <button
                                    type="button"
                                    onClick={() => hasChanges && toggle(entry.id)}
                                    className={`flex w-full flex-wrap items-center gap-3 px-4 py-3 text-left ${hasChanges ? "cursor-pointer hover:bg-zinc-50" : "cursor-default"}`}
                                >
                                    {hasChanges ? (
                                        isOpen ? <FiChevronDown className="size-4 shrink-0 text-zinc-400" /> : <FiChevronRight className="size-4 shrink-0 text-zinc-400" />
                                    ) : (
                                        <span className="size-4 shrink-0" />
                                    )}
                                    <span className={`inline-flex shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${ACTION_STYLES[entry.action]}`}>
                                        {ACTION_LABELS[entry.action]}
                                    </span>
                                    <span className="text-sm font-semibold text-zinc-950">
                                        {ENTITY_LABELS[entry.entityType] ?? entry.entityType}
                                        {entry.entityCode && <span className="text-sky-700"> · {entry.entityCode}</span>}
                                    </span>
                                    <span className="ml-auto text-xs text-zinc-500">
                                        {entry.userEmail ?? "—"} · {formatDateTime(entry.createdAt)}
                                    </span>
                                </button>

                                {isOpen && hasChanges && (
                                    <pre className="overflow-x-auto border-t border-zinc-100 bg-stone-50 px-4 py-3 text-xs leading-5 text-zinc-700">
                                        {JSON.stringify(entry.changes, null, 2)}
                                    </pre>
                                )}
                            </div>
                        );
                    })}

                    {data.totalPages > 1 && (
                        <div className="mt-4 flex items-center justify-center gap-3">
                            <button
                                type="button"
                                disabled={page <= 1}
                                onClick={() => setPage((current) => current - 1)}
                                className="inline-flex h-9 items-center rounded-md border border-zinc-300 bg-white px-3 text-sm font-semibold text-zinc-700 transition hover:border-sky-700 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Anterior
                            </button>
                            <p className="text-xs text-zinc-500">Página {data.page} de {data.totalPages}</p>
                            <button
                                type="button"
                                disabled={page >= data.totalPages}
                                onClick={() => setPage((current) => current + 1)}
                                className="inline-flex h-9 items-center rounded-md border border-zinc-300 bg-white px-3 text-sm font-semibold text-zinc-700 transition hover:border-sky-700 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Siguiente
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
