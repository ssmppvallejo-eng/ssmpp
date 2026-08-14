"use client";

import { useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import Spinner from "../Spinner";

interface TemplateRow {
    id: number;
    name: string;
    description?: string | null;
    postgraduateId: number;
    postgraduate: { title: string; level: string };
    indicators: { indicatorId: number }[];
    _count: { indicators: number };
}

interface PostgraduateOption {
    id: number;
    title: string;
}

interface CatalogIndicator {
    id: number;
    code: string;
    description: string;
}

interface CatalogJudgement {
    id: number;
    code: string;
    title: string;
    indicators: CatalogIndicator[];
}

interface CatalogComponent {
    id: number;
    code: string;
    title: string;
    judgements: CatalogJudgement[];
}

interface CatalogDimension {
    id: number;
    code: string;
    title: string;
    components: CatalogComponent[];
}

interface FormState {
    mode: "create" | "edit";
    id?: number;
    name: string;
    description: string;
    postgraduateId: number | "";
    indicatorIds: Set<number>;
}

export default function TemplatesManager() {
    const [templates, setTemplates] = useState<TemplateRow[]>([]);
    const [postgraduates, setPostgraduates] = useState<PostgraduateOption[]>([]);
    const [dimensions, setDimensions] = useState<CatalogDimension[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const [form, setForm] = useState<FormState | null>(null);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        Promise.all([
            fetch("/api/templates").then((response) => {
                if (!response.ok) throw new Error("No se pudieron obtener las plantillas");
                return response.json();
            }),
            fetch("/api/postgraduates").then((response) => {
                if (!response.ok) throw new Error("No se pudieron obtener los posgrados");
                return response.json();
            }),
            fetch("/api/dimensions").then((response) => {
                if (!response.ok) throw new Error("No se pudo obtener el instrumento");
                return response.json();
            }),
        ])
            .then(([templateData, postgraduateData, dimensionData]) => {
                if (cancelled) return;
                setTemplates(templateData);
                setPostgraduates(postgraduateData);
                setDimensions(dimensionData);
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

    const toggleIndicator = (id: number) => {
        if (!form) return;
        const next = new Set(form.indicatorIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setForm({ ...form, indicatorIds: next });
    };

    const canSubmit = form !== null
        && form.name.trim() !== ""
        && form.postgraduateId !== ""
        && form.indicatorIds.size > 0;

    const submitForm = async () => {
        if (!form || !canSubmit || saving) return;
        setSaving(true);
        setFormError(null);

        try {
            const response = await fetch(
                form.mode === "create" ? "/api/templates" : `/api/templates/${form.id}`,
                {
                    method: form.mode === "create" ? "POST" : "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: form.name,
                        description: form.description || null,
                        postgraduateId: form.postgraduateId,
                        indicatorIds: [...form.indicatorIds],
                    }),
                }
            );

            if (!response.ok) {
                const body = await response.json().catch(() => null);
                throw new Error(body?.message ?? "No se pudo guardar la plantilla");
            }

            setForm(null);
            setRefreshKey((key) => key + 1);
        } catch (error) {
            setFormError(error instanceof Error ? error.message : "Error inesperado");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (template: TemplateRow) => {
        const confirmed = window.confirm(`¿Eliminar la plantilla "${template.name}"?`);
        if (!confirmed) return;

        setErrorMessage(null);
        try {
            const response = await fetch(`/api/templates/${template.id}`, { method: "DELETE" });
            if (!response.ok) {
                const body = await response.json().catch(() => null);
                throw new Error(body?.message ?? "No se pudo eliminar");
            }
            setRefreshKey((key) => key + 1);
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Error inesperado");
        }
    };

    return (
        <div className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
            <header className="mb-8 flex flex-col gap-4 border-b border-zinc-200 pb-6 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase text-sky-700">Administración</p>
                    <h1 className="mt-2 text-3xl font-semibold leading-tight text-zinc-950 sm:text-4xl">
                        Plantillas
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
                        Conjuntos reutilizables de indicadores del instrumento, asociados a un posgrado. Al crear una
                        asignación puedes elegir una plantilla en lugar de seleccionar los indicadores uno por uno.
                    </p>
                </div>
                <button
                    type="button"
                    disabled={postgraduates.length === 0}
                    onClick={() => setForm({ mode: "create", name: "", description: "", postgraduateId: "", indicatorIds: new Set() })}
                    className="inline-flex h-11 items-center gap-2 rounded-md bg-sky-700 px-4 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <FiPlus className="size-4" />
                    Nueva plantilla
                </button>
            </header>

            {postgraduates.length === 0 && !loading && (
                <div className="mb-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    Primero registra al menos un posgrado: las plantillas pertenecen a un posgrado.
                </div>
            )}

            {errorMessage && (
                <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                    {errorMessage}
                </div>
            )}

            {loading ? (
                <Spinner label="Cargando plantillas…" className="min-h-48 justify-center" />
            ) : templates.length === 0 ? (
                <div className="border border-dashed border-zinc-300 bg-white px-6 py-12 text-center">
                    <p className="text-sm text-zinc-600">Todavía no hay plantillas registradas.</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {templates.map((template) => (
                        <article key={template.id} className="rounded-md border border-zinc-200 bg-white p-5">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h2 className="font-semibold text-zinc-950">{template.name}</h2>
                                    <p className="mt-1 text-xs text-zinc-500">
                                        {template.postgraduate.title} · {template._count.indicators} indicadores
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setForm({
                                            mode: "edit",
                                            id: template.id,
                                            name: template.name,
                                            description: template.description ?? "",
                                            postgraduateId: template.postgraduateId,
                                            indicatorIds: new Set(template.indicators.map((entry) => entry.indicatorId)),
                                        })}
                                        className="inline-flex h-8 items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-2.5 text-xs font-semibold text-zinc-700 transition hover:border-sky-700 hover:text-sky-800"
                                    >
                                        <FiEdit2 className="size-3.5" /> Editar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(template)}
                                        className="inline-flex h-8 items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-2.5 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                                    >
                                        <FiTrash2 className="size-3.5" /> Eliminar
                                    </button>
                                </div>
                            </div>
                            {template.description && (
                                <p className="mt-3 text-sm leading-6 text-zinc-600">{template.description}</p>
                            )}
                        </article>
                    ))}
                </div>
            )}

            {form && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 p-4">
                    <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-md border border-zinc-200 bg-white p-6 shadow-xl">
                        <div className="flex items-center justify-between gap-4">
                            <h2 className="text-lg font-semibold text-zinc-950">
                                {form.mode === "create" ? "Nueva plantilla" : `Editar plantilla`}
                            </h2>
                            <button type="button" onClick={() => setForm(null)} className="text-zinc-400 transition hover:text-zinc-950">
                                <FiX className="size-5" />
                            </button>
                        </div>

                        {formError && (
                            <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                                {formError}
                            </div>
                        )}

                        <div className="mt-5 flex flex-col gap-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <label className="block">
                                    <span className="text-sm font-semibold text-zinc-950">Nombre</span>
                                    <input
                                        value={form.name}
                                        onChange={(event) => setForm({ ...form, name: event.target.value })}
                                        className="mt-2 h-11 w-full rounded-md border border-zinc-300 px-3 text-sm text-zinc-900"
                                    />
                                </label>
                                <label className="block">
                                    <span className="text-sm font-semibold text-zinc-950">Posgrado</span>
                                    <select
                                        value={form.postgraduateId}
                                        onChange={(event) => setForm({ ...form, postgraduateId: event.target.value === "" ? "" : Number(event.target.value) })}
                                        className="mt-2 h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900"
                                    >
                                        <option value="">Selecciona un posgrado...</option>
                                        {postgraduates.map((postgraduate) => (
                                            <option key={postgraduate.id} value={postgraduate.id}>{postgraduate.title}</option>
                                        ))}
                                    </select>
                                </label>
                            </div>

                            <label className="block">
                                <span className="text-sm font-semibold text-zinc-950">Descripción (opcional)</span>
                                <textarea
                                    rows={2}
                                    value={form.description}
                                    onChange={(event) => setForm({ ...form, description: event.target.value })}
                                    className="mt-2 w-full resize-y rounded-md border border-zinc-300 p-3 text-sm leading-6 text-zinc-900"
                                />
                            </label>

                            <div>
                                <p className="text-sm font-semibold text-zinc-950">
                                    Indicadores ({form.indicatorIds.size} seleccionados)
                                </p>
                                <div className="mt-3 flex max-h-80 flex-col gap-3 overflow-y-auto rounded-md border border-zinc-200 bg-stone-50 p-3">
                                    {dimensions.map((dimension) => (
                                        <div key={dimension.id}>
                                            <p className="text-xs font-semibold uppercase text-sky-700">
                                                {dimension.code} · {dimension.title}
                                            </p>
                                            {dimension.components.map((component) =>
                                                component.judgements.map((judgement) => (
                                                    <div key={judgement.id} className="mt-2">
                                                        <p className="text-xs font-semibold text-zinc-600">
                                                            {judgement.code} · {judgement.title}
                                                        </p>
                                                        <div className="mt-1 flex flex-col gap-1">
                                                            {judgement.indicators.map((indicator) => (
                                                                <label
                                                                    key={indicator.id}
                                                                    className="flex cursor-pointer items-start gap-2 rounded-md border border-transparent px-2 py-1.5 transition hover:bg-white"
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={form.indicatorIds.has(indicator.id)}
                                                                        onChange={() => toggleIndicator(indicator.id)}
                                                                        className="mt-1 size-4 accent-sky-700"
                                                                    />
                                                                    <span className="text-xs leading-5 text-zinc-700">
                                                                        <span className="font-semibold text-zinc-950">{indicator.code}</span>
                                                                        {" — "}
                                                                        {indicator.description}
                                                                    </span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setForm(null)}
                                className="inline-flex h-11 items-center rounded-md border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                disabled={!canSubmit || saving}
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
