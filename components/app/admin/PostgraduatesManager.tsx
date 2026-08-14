"use client";

import { useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import Spinner from "../Spinner";

interface PostgraduateRow {
    id: number;
    title: string;
    level: string;
    knowledgeArea: string;
    _count: { templates: number; users: number };
}

const LEVEL_LABELS: Record<string, string> = {
    ESPECIALIDADES: "Especialidad",
    MAESTRIAS: "Maestría",
    DOCTORADOS: "Doctorado",
    ESPECIALIDADES_MEDICAS: "Especialidad médica",
};

const AREA_LABELS: Record<string, string> = {
    CIENCIAS_EXACTAS: "Ciencias exactas",
    CIENCIAS_NATURALES_Y_AGROPECUARIAS: "Ciencias naturales y agropecuarias",
    CIENCIAS_DE_LA_SALUD: "Ciencias de la salud",
    CIENCIAS_DE_LA_EDUCACION_Y_HUMANIDADES: "Ciencias de la educación y humanidades",
    CIENCIAS_SOCIALES_Y_ADMINISTRATIVAS: "Ciencias sociales y administrativas",
    INGENIERIA_Y_TECNOLOGIAS: "Ingeniería y tecnologías",
};

interface FormState {
    mode: "create" | "edit";
    id?: number;
    title: string;
    level: string;
    knowledgeArea: string;
}

export default function PostgraduatesManager() {
    const [postgraduates, setPostgraduates] = useState<PostgraduateRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const [form, setForm] = useState<FormState | null>(null);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        fetch("/api/postgraduates")
            .then((response) => {
                if (!response.ok) throw new Error("No se pudieron obtener los posgrados");
                return response.json();
            })
            .then((data: PostgraduateRow[]) => {
                if (!cancelled) setPostgraduates(data);
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

    const submitForm = async () => {
        if (!form || saving) return;
        setSaving(true);
        setFormError(null);

        try {
            const response = await fetch(
                form.mode === "create" ? "/api/postgraduates" : `/api/postgraduates/${form.id}`,
                {
                    method: form.mode === "create" ? "POST" : "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title: form.title,
                        level: form.level,
                        knowledgeArea: form.knowledgeArea,
                    }),
                }
            );

            if (!response.ok) {
                const body = await response.json().catch(() => null);
                throw new Error(body?.message ?? "No se pudo guardar el posgrado");
            }

            setForm(null);
            setRefreshKey((key) => key + 1);
        } catch (error) {
            setFormError(error instanceof Error ? error.message : "Error inesperado");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (postgraduate: PostgraduateRow) => {
        const confirmed = window.confirm(
            `¿Eliminar el posgrado "${postgraduate.title}"? Se quitarán también sus vínculos con usuarios.`
        );
        if (!confirmed) return;

        setErrorMessage(null);
        try {
            const response = await fetch(`/api/postgraduates/${postgraduate.id}`, { method: "DELETE" });
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
                        Posgrados
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
                        Programas de posgrado a evaluar. Los usuarios se vinculan a posgrados desde el panel de usuarios,
                        y las plantillas de evaluación pertenecen a un posgrado.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setForm({ mode: "create", title: "", level: "MAESTRIAS", knowledgeArea: "CIENCIAS_EXACTAS" })}
                    className="inline-flex h-11 items-center gap-2 rounded-md bg-sky-700 px-4 text-sm font-semibold text-white transition hover:bg-sky-800"
                >
                    <FiPlus className="size-4" />
                    Nuevo posgrado
                </button>
            </header>

            {errorMessage && (
                <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                    {errorMessage}
                </div>
            )}

            {loading ? (
                <Spinner label="Cargando posgrados…" className="min-h-48 justify-center" />
            ) : postgraduates.length === 0 ? (
                <div className="border border-dashed border-zinc-300 bg-white px-6 py-12 text-center">
                    <p className="text-sm text-zinc-600">Todavía no hay posgrados registrados.</p>
                </div>
            ) : (
                <div className="overflow-x-auto border border-zinc-200 bg-white">
                    <table className="w-full min-w-[680px] text-left text-sm">
                        <thead>
                            <tr className="border-b border-zinc-200 text-xs font-semibold uppercase text-zinc-500">
                                <th className="px-4 py-3">Posgrado</th>
                                <th className="px-4 py-3">Nivel</th>
                                <th className="px-4 py-3">Área de conocimiento</th>
                                <th className="px-4 py-3">Plantillas</th>
                                <th className="px-4 py-3">Usuarios</th>
                                <th className="px-4 py-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {postgraduates.map((postgraduate) => (
                                <tr key={postgraduate.id} className="border-b border-zinc-100 last:border-b-0">
                                    <td className="px-4 py-3 font-semibold text-zinc-950">{postgraduate.title}</td>
                                    <td className="px-4 py-3 text-zinc-700">{LEVEL_LABELS[postgraduate.level] ?? postgraduate.level}</td>
                                    <td className="px-4 py-3 text-zinc-700">{AREA_LABELS[postgraduate.knowledgeArea] ?? postgraduate.knowledgeArea}</td>
                                    <td className="px-4 py-3 text-zinc-700">{postgraduate._count.templates}</td>
                                    <td className="px-4 py-3 text-zinc-700">{postgraduate._count.users}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setForm({
                                                    mode: "edit",
                                                    id: postgraduate.id,
                                                    title: postgraduate.title,
                                                    level: postgraduate.level,
                                                    knowledgeArea: postgraduate.knowledgeArea,
                                                })}
                                                className="inline-flex h-8 items-center gap-1.5 rounded-md border border-zinc-300 bg-white px-2.5 text-xs font-semibold text-zinc-700 transition hover:border-sky-700 hover:text-sky-800"
                                            >
                                                <FiEdit2 className="size-3.5" /> Editar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(postgraduate)}
                                                className="inline-flex h-8 items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-2.5 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                                            >
                                                <FiTrash2 className="size-3.5" /> Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {form && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 p-4">
                    <div className="w-full max-w-lg rounded-md border border-zinc-200 bg-white p-6 shadow-xl">
                        <div className="flex items-center justify-between gap-4">
                            <h2 className="text-lg font-semibold text-zinc-950">
                                {form.mode === "create" ? "Nuevo posgrado" : "Editar posgrado"}
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
                            <label className="block">
                                <span className="text-sm font-semibold text-zinc-950">Nombre del posgrado</span>
                                <input
                                    value={form.title}
                                    onChange={(event) => setForm({ ...form, title: event.target.value })}
                                    className="mt-2 h-11 w-full rounded-md border border-zinc-300 px-3 text-sm text-zinc-900"
                                />
                            </label>

                            <label className="block">
                                <span className="text-sm font-semibold text-zinc-950">Nivel</span>
                                <select
                                    value={form.level}
                                    onChange={(event) => setForm({ ...form, level: event.target.value })}
                                    className="mt-2 h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900"
                                >
                                    {Object.entries(LEVEL_LABELS).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                            </label>

                            <label className="block">
                                <span className="text-sm font-semibold text-zinc-950">Área de conocimiento</span>
                                <select
                                    value={form.knowledgeArea}
                                    onChange={(event) => setForm({ ...form, knowledgeArea: event.target.value })}
                                    className="mt-2 h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900"
                                >
                                    {Object.entries(AREA_LABELS).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                            </label>
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
                                disabled={saving || !form.title.trim()}
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
