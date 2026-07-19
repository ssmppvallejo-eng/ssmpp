"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiChevronDown, FiChevronRight, FiClock, FiEdit2, FiPlus, FiTrash2, FiX } from "react-icons/fi";

interface CatalogDescriptor {
    id: number;
    title: string;
    description: string;
    value: number;
}

interface CatalogIndicator {
    id: number;
    code: string;
    description: string;
    justification?: string | null;
    descriptors: CatalogDescriptor[];
}

interface CatalogJudgement {
    id: number;
    code: string;
    title: string;
    description?: string | null;
    indicators: CatalogIndicator[];
}

interface CatalogComponent {
    id: number;
    code: string;
    title: string;
    description?: string | null;
    judgements: CatalogJudgement[];
}

interface CatalogDimension {
    id: number;
    code: string;
    title: string;
    description?: string | null;
    components: CatalogComponent[];
}

type EntityKind = "dimension" | "component" | "judgement" | "indicator" | "descriptor";

interface FormTarget {
    kind: EntityKind;
    mode: "create" | "edit";
    parentId?: number;
    entityId?: number;
    heading: string;
}

const DEFAULT_DESCRIPTOR_TITLES = ["No logrado", "En proceso", "Plenamente logrado"];

const KIND_LABELS: Record<EntityKind, string> = {
    dimension: "dimensión",
    component: "componente",
    judgement: "criterio",
    indicator: "indicador",
    descriptor: "descriptor",
};

const COLLECTION_URLS: Record<EntityKind, string> = {
    dimension: "/api/dimensions",
    component: "/api/components",
    judgement: "/api/judgements",
    indicator: "/api/indicators",
    descriptor: "/api/descriptors",
};

const PARENT_FIELD: Record<EntityKind, string | null> = {
    dimension: null,
    component: "dimensionId",
    judgement: "componentId",
    indicator: "judgementId",
    descriptor: null,
};

export default function InstrumentManager() {
    const [dimensions, setDimensions] = useState<CatalogDimension[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const [expandedDimensions, setExpandedDimensions] = useState<Set<number>>(new Set());
    const [expandedIndicators, setExpandedIndicators] = useState<Set<number>>(new Set());

    const [form, setForm] = useState<FormTarget | null>(null);
    const [values, setValues] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        fetch("/api/dimensions")
            .then((response) => {
                if (!response.ok) throw new Error("No se pudo obtener el instrumento");
                return response.json();
            })
            .then((data: CatalogDimension[]) => {
                if (!cancelled) setDimensions(data);
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
    }, [refreshKey]);

    const toggle = (set: Set<number>, id: number, apply: (next: Set<number>) => void) => {
        const next = new Set(set);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        apply(next);
    };

    const openForm = (target: FormTarget, initial: Record<string, string> = {}) => {
        setFormError(null);
        setForm(target);

        if (target.kind === "indicator" && target.mode === "create") {
            setValues({
                code: "", description: "", justification: "",
                d1title: DEFAULT_DESCRIPTOR_TITLES[0], d1desc: "",
                d2title: DEFAULT_DESCRIPTOR_TITLES[1], d2desc: "",
                d3title: DEFAULT_DESCRIPTOR_TITLES[2], d3desc: "",
                ...initial,
            });
            return;
        }

        setValues({ code: "", title: "", description: "", justification: "", ...initial });
    };

    const closeForm = () => {
        setForm(null);
        setValues({});
        setFormError(null);
    };

    const setValue = (key: string, value: string) => {
        setValues((current) => ({ ...current, [key]: value }));
    };

    const buildPayload = (): Record<string, unknown> => {
        if (!form) return {};

        if (form.kind === "descriptor") {
            return { title: values.title, description: values.description };
        }

        if (form.kind === "indicator") {
            const payload: Record<string, unknown> = {
                code: values.code,
                description: values.description,
                justification: values.justification || null,
            };
            if (form.mode === "create") {
                payload.descriptors = [1, 2, 3].map((n) => ({
                    title: values[`d${n}title`],
                    description: values[`d${n}desc`],
                }));
            }
            return payload;
        }

        return {
            code: values.code,
            title: values.title,
            description: values.description || null,
        };
    };

    const submitForm = async () => {
        if (!form || saving) return;
        setSaving(true);
        setFormError(null);

        const payload = buildPayload();
        const parentField = PARENT_FIELD[form.kind];
        if (form.mode === "create" && parentField && form.parentId !== undefined) {
            payload[parentField] = form.parentId;
        }

        const url = form.mode === "create"
            ? COLLECTION_URLS[form.kind]
            : `${COLLECTION_URLS[form.kind]}/${form.entityId}`;

        try {
            const response = await fetch(url, {
                method: form.mode === "create" ? "POST" : "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const body = await response.json().catch(() => null);
                throw new Error(body?.message ?? "No se pudo guardar");
            }

            closeForm();
            setRefreshKey((key) => key + 1);
        } catch (error) {
            setFormError(error instanceof Error ? error.message : "Error inesperado");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (kind: EntityKind, id: number, label: string) => {
        const confirmed = window.confirm(
            `¿Eliminar ${KIND_LABELS[kind]} ${label}? Esta acción no se puede deshacer.`
        );
        if (!confirmed) return;

        setErrorMessage(null);
        try {
            const response = await fetch(`${COLLECTION_URLS[kind]}/${id}`, { method: "DELETE" });
            if (!response.ok) {
                const body = await response.json().catch(() => null);
                throw new Error(body?.message ?? "No se pudo eliminar");
            }
            setRefreshKey((key) => key + 1);
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Error inesperado");
        }
    };

    const actionButton = "inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs font-semibold transition";

    return (
        <div className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
            <header className="mb-8 flex flex-col gap-4 border-b border-zinc-200 pb-6 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase text-sky-700">Administración</p>
                    <h1 className="mt-2 text-3xl font-semibold leading-tight text-zinc-950 sm:text-4xl">
                        Instrumento
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
                        Gestiona la jerarquía del instrumento: dimensiones, componentes, criterios, indicadores y sus
                        descriptores de logro. Cada indicador mantiene exactamente 3 descriptores con ponderaciones 1–3.
                    </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                    <Link
                        href="/app/admin/instrument/history"
                        className="inline-flex h-11 items-center gap-2 rounded-md border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-700 transition hover:border-sky-700 hover:text-sky-800"
                    >
                        <FiClock className="size-4" />
                        Historial
                    </Link>
                    <button
                        type="button"
                        onClick={() => openForm({ kind: "dimension", mode: "create", heading: "Nueva dimensión" })}
                        className="inline-flex h-11 items-center gap-2 rounded-md bg-sky-700 px-4 text-sm font-semibold text-white transition hover:bg-sky-800"
                    >
                        <FiPlus className="size-4" />
                        Nueva dimensión
                    </button>
                </div>
            </header>

            {errorMessage && (
                <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                    {errorMessage}
                </div>
            )}

            {loading ? (
                <p className="text-sm text-zinc-500">Cargando instrumento...</p>
            ) : (
                <div className="flex flex-col gap-4">
                    {dimensions.map((dimension) => {
                        const isOpen = expandedDimensions.has(dimension.id);

                        return (
                            <section key={dimension.id} className="rounded-md border border-zinc-200 bg-white">
                                <div className="flex flex-wrap items-center gap-3 px-5 py-4">
                                    <button
                                        type="button"
                                        onClick={() => toggle(expandedDimensions, dimension.id, setExpandedDimensions)}
                                        className="grid size-8 place-items-center rounded-md border border-zinc-200 text-zinc-600 transition hover:border-sky-700 hover:text-sky-800"
                                    >
                                        {isOpen ? <FiChevronDown /> : <FiChevronRight />}
                                    </button>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-semibold text-zinc-950">
                                            <span className="text-sky-700">{dimension.code}</span> · {dimension.title}
                                        </p>
                                        {dimension.description && (
                                            <p className="truncate text-xs text-zinc-500">{dimension.description}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            onClick={() => openForm(
                                                { kind: "component", mode: "create", parentId: dimension.id, heading: `Nuevo componente en ${dimension.code}` }
                                            )}
                                            className={`${actionButton} border-sky-200 bg-sky-50 text-sky-800 hover:bg-sky-100`}
                                        >
                                            <FiPlus className="size-3.5" /> Componente
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => openForm(
                                                { kind: "dimension", mode: "edit", entityId: dimension.id, heading: `Editar dimensión ${dimension.code}` },
                                                { code: dimension.code, title: dimension.title, description: dimension.description ?? "" }
                                            )}
                                            className={`${actionButton} border-zinc-300 bg-white text-zinc-700 hover:border-sky-700 hover:text-sky-800`}
                                        >
                                            <FiEdit2 className="size-3.5" /> Editar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete("dimension", dimension.id, dimension.code)}
                                            className={`${actionButton} border-red-200 bg-red-50 text-red-700 hover:bg-red-100`}
                                        >
                                            <FiTrash2 className="size-3.5" /> Eliminar
                                        </button>
                                    </div>
                                </div>

                                {isOpen && (
                                    <div className="flex flex-col gap-4 border-t border-zinc-100 px-5 py-4">
                                        {dimension.components.length === 0 && (
                                            <p className="text-sm text-zinc-500">Esta dimensión no tiene componentes.</p>
                                        )}
                                        {dimension.components.map((component) => (
                                            <div key={component.id} className="rounded-md border border-zinc-200 bg-stone-50 p-4">
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-semibold text-zinc-950">
                                                            Componente <span className="text-sky-700">{component.code}</span> · {component.title}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => openForm(
                                                                { kind: "judgement", mode: "create", parentId: component.id, heading: `Nuevo criterio en ${component.code}` }
                                                            )}
                                                            className={`${actionButton} border-sky-200 bg-sky-50 text-sky-800 hover:bg-sky-100`}
                                                        >
                                                            <FiPlus className="size-3.5" /> Criterio
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => openForm(
                                                                { kind: "component", mode: "edit", entityId: component.id, heading: `Editar componente ${component.code}` },
                                                                { code: component.code, title: component.title, description: component.description ?? "" }
                                                            )}
                                                            className={`${actionButton} border-zinc-300 bg-white text-zinc-700 hover:border-sky-700 hover:text-sky-800`}
                                                        >
                                                            <FiEdit2 className="size-3.5" /> Editar
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete("component", component.id, component.code)}
                                                            className={`${actionButton} border-red-200 bg-red-50 text-red-700 hover:bg-red-100`}
                                                        >
                                                            <FiTrash2 className="size-3.5" /> Eliminar
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="mt-3 flex flex-col gap-3">
                                                    {component.judgements.map((judgement) => (
                                                        <div key={judgement.id} className="rounded-md border border-zinc-200 bg-white p-4">
                                                            <div className="flex flex-wrap items-center gap-3">
                                                                <div className="min-w-0 flex-1">
                                                                    <p className="text-sm font-semibold text-zinc-950">
                                                                        Criterio <span className="text-sky-700">{judgement.code}</span> · {judgement.title}
                                                                    </p>
                                                                    {judgement.description && (
                                                                        <p className="mt-1 text-xs leading-5 text-zinc-500">{judgement.description}</p>
                                                                    )}
                                                                </div>
                                                                <div className="flex flex-wrap gap-2">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => openForm(
                                                                            { kind: "indicator", mode: "create", parentId: judgement.id, heading: `Nuevo indicador en ${judgement.code}` }
                                                                        )}
                                                                        className={`${actionButton} border-sky-200 bg-sky-50 text-sky-800 hover:bg-sky-100`}
                                                                    >
                                                                        <FiPlus className="size-3.5" /> Indicador
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => openForm(
                                                                            { kind: "judgement", mode: "edit", entityId: judgement.id, heading: `Editar criterio ${judgement.code}` },
                                                                            { code: judgement.code, title: judgement.title, description: judgement.description ?? "" }
                                                                        )}
                                                                        className={`${actionButton} border-zinc-300 bg-white text-zinc-700 hover:border-sky-700 hover:text-sky-800`}
                                                                    >
                                                                        <FiEdit2 className="size-3.5" /> Editar
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleDelete("judgement", judgement.id, judgement.code)}
                                                                        className={`${actionButton} border-red-200 bg-red-50 text-red-700 hover:bg-red-100`}
                                                                    >
                                                                        <FiTrash2 className="size-3.5" /> Eliminar
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            <div className="mt-3 flex flex-col gap-2">
                                                                {judgement.indicators.map((indicator) => {
                                                                    const indicatorOpen = expandedIndicators.has(indicator.id);
                                                                    return (
                                                                        <div key={indicator.id} className="rounded-md border border-zinc-100 bg-stone-50/60 p-3">
                                                                            <div className="flex flex-wrap items-start gap-2">
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => toggle(expandedIndicators, indicator.id, setExpandedIndicators)}
                                                                                    className="mt-0.5 grid size-6 place-items-center rounded border border-zinc-200 text-zinc-500 transition hover:text-sky-800"
                                                                                >
                                                                                    {indicatorOpen ? <FiChevronDown className="size-3.5" /> : <FiChevronRight className="size-3.5" />}
                                                                                </button>
                                                                                <div className="min-w-0 flex-1">
                                                                                    <p className="text-sm leading-6 text-zinc-800">
                                                                                        <span className="font-semibold text-sky-700">{indicator.code}</span>
                                                                                        {" — "}
                                                                                        {indicator.description}
                                                                                    </p>
                                                                                </div>
                                                                                <div className="flex gap-2">
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => openForm(
                                                                                            { kind: "indicator", mode: "edit", entityId: indicator.id, heading: `Editar indicador ${indicator.code}` },
                                                                                            { code: indicator.code, description: indicator.description, justification: indicator.justification ?? "" }
                                                                                        )}
                                                                                        className={`${actionButton} border-zinc-300 bg-white text-zinc-700 hover:border-sky-700 hover:text-sky-800`}
                                                                                    >
                                                                                        <FiEdit2 className="size-3.5" />
                                                                                    </button>
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => handleDelete("indicator", indicator.id, indicator.code)}
                                                                                        className={`${actionButton} border-red-200 bg-red-50 text-red-700 hover:bg-red-100`}
                                                                                    >
                                                                                        <FiTrash2 className="size-3.5" />
                                                                                    </button>
                                                                                </div>
                                                                            </div>

                                                                            {indicatorOpen && (
                                                                                <div className="mt-3 grid gap-2 md:grid-cols-3">
                                                                                    {indicator.descriptors.map((descriptor) => (
                                                                                        <div key={descriptor.id} className="rounded-md border border-zinc-200 bg-white p-3">
                                                                                            <div className="flex items-start justify-between gap-2">
                                                                                                <p className="text-xs font-semibold text-zinc-950">
                                                                                                    {descriptor.value}. {descriptor.title}
                                                                                                </p>
                                                                                                <button
                                                                                                    type="button"
                                                                                                    onClick={() => openForm(
                                                                                                        { kind: "descriptor", mode: "edit", entityId: descriptor.id, heading: `Editar descriptor (valor ${descriptor.value})` },
                                                                                                        { title: descriptor.title, description: descriptor.description }
                                                                                                    )}
                                                                                                    className="text-zinc-400 transition hover:text-sky-800"
                                                                                                >
                                                                                                    <FiEdit2 className="size-3.5" />
                                                                                                </button>
                                                                                            </div>
                                                                                            <p className="mt-1.5 text-xs leading-5 text-zinc-600">{descriptor.description}</p>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        );
                    })}
                </div>
            )}

            {form && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 p-4">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-md border border-zinc-200 bg-white p-6 shadow-xl">
                        <div className="flex items-center justify-between gap-4">
                            <h2 className="text-lg font-semibold text-zinc-950">{form.heading}</h2>
                            <button type="button" onClick={closeForm} className="text-zinc-400 transition hover:text-zinc-950">
                                <FiX className="size-5" />
                            </button>
                        </div>

                        {formError && (
                            <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                                {formError}
                            </div>
                        )}

                        <div className="mt-5 flex flex-col gap-4">
                            {form.kind !== "descriptor" && (
                                <label className="block">
                                    <span className="text-sm font-semibold text-zinc-950">Código único</span>
                                    <input
                                        value={values.code ?? ""}
                                        onChange={(event) => setValue("code", event.target.value)}
                                        className="mt-2 h-11 w-full rounded-md border border-zinc-300 px-3 text-sm text-zinc-900"
                                    />
                                </label>
                            )}

                            {(form.kind === "dimension" || form.kind === "component" || form.kind === "judgement" || form.kind === "descriptor") && (
                                <label className="block">
                                    <span className="text-sm font-semibold text-zinc-950">Título</span>
                                    <input
                                        value={values.title ?? ""}
                                        onChange={(event) => setValue("title", event.target.value)}
                                        className="mt-2 h-11 w-full rounded-md border border-zinc-300 px-3 text-sm text-zinc-900"
                                    />
                                </label>
                            )}

                            <label className="block">
                                <span className="text-sm font-semibold text-zinc-950">
                                    {form.kind === "indicator" || form.kind === "descriptor" ? "Descripción" : "Descripción (opcional)"}
                                </span>
                                <textarea
                                    rows={3}
                                    value={values.description ?? ""}
                                    onChange={(event) => setValue("description", event.target.value)}
                                    className="mt-2 w-full resize-y rounded-md border border-zinc-300 p-3 text-sm leading-6 text-zinc-900"
                                />
                            </label>

                            {form.kind === "indicator" && (
                                <label className="block">
                                    <span className="text-sm font-semibold text-zinc-950">Justificación normativa (opcional)</span>
                                    <textarea
                                        rows={2}
                                        value={values.justification ?? ""}
                                        onChange={(event) => setValue("justification", event.target.value)}
                                        className="mt-2 w-full resize-y rounded-md border border-zinc-300 p-3 text-sm leading-6 text-zinc-900"
                                    />
                                </label>
                            )}

                            {form.kind === "indicator" && form.mode === "create" && (
                                <div className="rounded-md border border-zinc-200 bg-stone-50 p-4">
                                    <p className="text-sm font-semibold text-zinc-950">Descriptores de logro</p>
                                    <p className="mt-1 text-xs leading-5 text-zinc-500">
                                        Exactamente 3, con ponderaciones fijas 1, 2 y 3.
                                    </p>
                                    <div className="mt-3 flex flex-col gap-4">
                                        {[1, 2, 3].map((n) => (
                                            <div key={n}>
                                                <div className="flex items-center gap-2">
                                                    <span className="grid size-6 shrink-0 place-items-center rounded-full border border-zinc-300 text-xs font-semibold text-zinc-600">
                                                        {n}
                                                    </span>
                                                    <input
                                                        value={values[`d${n}title`] ?? ""}
                                                        onChange={(event) => setValue(`d${n}title`, event.target.value)}
                                                        className="h-10 w-full rounded-md border border-zinc-300 px-3 text-sm text-zinc-900"
                                                    />
                                                </div>
                                                <textarea
                                                    rows={2}
                                                    placeholder="Descripción del nivel de logro"
                                                    value={values[`d${n}desc`] ?? ""}
                                                    onChange={(event) => setValue(`d${n}desc`, event.target.value)}
                                                    className="mt-2 w-full resize-y rounded-md border border-zinc-300 p-3 text-sm leading-6 text-zinc-900"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={closeForm}
                                className="inline-flex h-11 items-center rounded-md border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                disabled={saving}
                                onClick={submitForm}
                                className="inline-flex h-11 items-center rounded-md bg-sky-700 px-5 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {saving ? "Guardando..." : "Guardar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
