"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiCheck } from "react-icons/fi";

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
    description?: string | null;
    components: CatalogComponent[];
}

interface CatalogTemplate {
    id: number;
    name: string;
    description?: string | null;
    postgraduate: { title: string; level: string };
    _count: { indicators: number };
}

interface AssignableUser {
    id: number;
    email: string;
    name?: string | null;
    role: string;
    accessStatus: string;
}

type Mode = "indicators" | "template";

export default function AssignmentCreator() {
    const router = useRouter();

    const [dimensions, setDimensions] = useState<CatalogDimension[]>([]);
    const [templates, setTemplates] = useState<CatalogTemplate[]>([]);
    const [users, setUsers] = useState<AssignableUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [dimensionId, setDimensionId] = useState<number | null>(null);
    const [mode, setMode] = useState<Mode>("indicators");
    const [selectedIndicators, setSelectedIndicators] = useState<Set<number>>(new Set());
    const [templateId, setTemplateId] = useState<number | null>(null);
    const [dueDate, setDueDate] = useState("");
    const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        let cancelled = false;

        Promise.all([
            fetch("/api/dimensions").then((response) => {
                if (!response.ok) throw new Error("No se pudo obtener el catálogo de dimensiones");
                return response.json();
            }),
            fetch("/api/templates").then((response) => {
                if (!response.ok) throw new Error("No se pudieron obtener las plantillas");
                return response.json();
            }),
            fetch("/api/users").then((response) => {
                if (!response.ok) throw new Error("No se pudieron obtener los usuarios");
                return response.json();
            }),
        ])
            .then(([dimensionData, templateData, userData]) => {
                if (cancelled) return;
                setDimensions(dimensionData);
                setTemplates(templateData);
                setUsers(userData.filter((user: AssignableUser) => user.accessStatus === "APROBADO"));
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

    const currentDimension = useMemo(
        () => dimensions.find((dimension) => dimension.id === dimensionId) ?? null,
        [dimensions, dimensionId],
    );

    const selectDimension = (id: number) => {
        setDimensionId(id);
        setSelectedIndicators(new Set());
    };

    const toggleIndicator = (id: number) => {
        setSelectedIndicators((current) => {
            const next = new Set(current);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleUser = (id: number) => {
        setSelectedUsers((current) => {
            const next = new Set(current);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const canSubmit =
        dimensionId !== null &&
        dueDate !== "" &&
        selectedUsers.size > 0 &&
        (mode === "indicators" ? selectedIndicators.size > 0 : templateId !== null);

    const handleSubmit = async () => {
        if (!canSubmit || saving) return;
        setSaving(true);
        setErrorMessage(null);

        try {
            const response = await fetch("/api/assignment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    dimensionId,
                    dueDate,
                    userIds: [...selectedUsers],
                    ...(mode === "indicators"
                        ? { indicatorIds: [...selectedIndicators] }
                        : { templateId }),
                }),
            });

            if (!response.ok) {
                const body = await response.json().catch(() => null);
                throw new Error(body?.message ?? "No se pudo crear la asignación");
            }

            router.push("/app/admin/assignments");
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Error inesperado");
            setSaving(false);
        }
    };

    return (
        <div className="mx-auto w-full max-w-5xl px-5 py-6 sm:px-8 lg:px-10">
            <Link
                href="/app/admin/assignments"
                className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-sky-800"
            >
                <FiArrowLeft />
                Volver a asignaciones
            </Link>

            <header className="mb-8 mt-4 border-b border-zinc-200 pb-6">
                <p className="text-sm font-semibold uppercase text-sky-700">Administración</p>
                <h1 className="mt-2 text-3xl font-semibold leading-tight text-zinc-950 sm:text-4xl">
                    Nueva asignación
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
                    Elige la dimensión a evaluar, define los indicadores (por plantilla o de forma manual),
                    la fecha de vencimiento y los usuarios responsables de responderla.
                </p>
            </header>

            {errorMessage && (
                <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                    {errorMessage}
                </div>
            )}

            {loading ? (
                <p className="text-sm text-zinc-500">Cargando catálogo...</p>
            ) : (
                <div className="flex flex-col gap-8">
                    <section>
                        <h2 className="text-sm font-semibold uppercase text-zinc-500">1. Dimensión</h2>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                            {dimensions.map((dimension) => (
                                <button
                                    key={dimension.id}
                                    type="button"
                                    onClick={() => selectDimension(dimension.id)}
                                    className={`border p-4 text-left transition ${
                                        dimensionId === dimension.id
                                            ? "border-sky-700 bg-sky-50"
                                            : "border-zinc-200 bg-white hover:border-zinc-400"
                                    }`}
                                >
                                    <p className="text-xs font-semibold uppercase text-sky-700">{dimension.code}</p>
                                    <p className="mt-1 font-semibold text-zinc-950">{dimension.title}</p>
                                    {dimension.description && (
                                        <p className="mt-1 text-xs leading-5 text-zinc-600">{dimension.description}</p>
                                    )}
                                </button>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-sm font-semibold uppercase text-zinc-500">2. Indicadores</h2>
                        <div className="mt-3 flex gap-2">
                            <button
                                type="button"
                                onClick={() => setMode("indicators")}
                                className={`h-9 rounded-md border px-4 text-sm font-semibold transition ${
                                    mode === "indicators"
                                        ? "border-sky-700 bg-sky-50 text-sky-800"
                                        : "border-zinc-300 bg-white text-zinc-600 hover:border-zinc-400"
                                }`}
                            >
                                Por indicador
                            </button>
                            <button
                                type="button"
                                onClick={() => setMode("template")}
                                className={`h-9 rounded-md border px-4 text-sm font-semibold transition ${
                                    mode === "template"
                                        ? "border-sky-700 bg-sky-50 text-sky-800"
                                        : "border-zinc-300 bg-white text-zinc-600 hover:border-zinc-400"
                                }`}
                            >
                                Por plantilla
                            </button>
                        </div>

                        {mode === "indicators" ? (
                            !currentDimension ? (
                                <p className="mt-4 text-sm text-zinc-500">Primero selecciona una dimensión.</p>
                            ) : (
                                <div className="mt-4 flex flex-col gap-4">
                                    {currentDimension.components.map((component) => (
                                        <div key={component.id} className="border border-zinc-200 bg-white p-4">
                                            <p className="text-xs font-semibold uppercase text-zinc-500">
                                                Componente {component.code} · {component.title}
                                            </p>
                                            {component.judgements.map((judgement) => (
                                                <div key={judgement.id} className="mt-3">
                                                    <p className="text-sm font-semibold text-zinc-800">
                                                        {judgement.code} · {judgement.title}
                                                    </p>
                                                    <div className="mt-2 flex flex-col gap-2">
                                                        {judgement.indicators.map((indicator) => (
                                                            <label
                                                                key={indicator.id}
                                                                className="flex cursor-pointer items-start gap-3 rounded-md border border-zinc-100 px-3 py-2 transition hover:bg-zinc-50"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedIndicators.has(indicator.id)}
                                                                    onChange={() => toggleIndicator(indicator.id)}
                                                                    className="mt-1 size-4 accent-sky-700"
                                                                />
                                                                <span className="text-sm leading-6 text-zinc-700">
                                                                    <span className="font-semibold text-zinc-950">{indicator.code}</span>
                                                                    {" — "}
                                                                    {indicator.description}
                                                                </span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                    <p className="text-xs text-zinc-500">
                                        {selectedIndicators.size} indicador(es) seleccionado(s)
                                    </p>
                                </div>
                            )
                        ) : templates.length === 0 ? (
                            <p className="mt-4 text-sm text-zinc-500">
                                No hay plantillas registradas todavía. Usa el modo por indicador.
                            </p>
                        ) : (
                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                {templates.map((template) => (
                                    <button
                                        key={template.id}
                                        type="button"
                                        onClick={() => setTemplateId(template.id)}
                                        className={`border p-4 text-left transition ${
                                            templateId === template.id
                                                ? "border-sky-700 bg-sky-50"
                                                : "border-zinc-200 bg-white hover:border-zinc-400"
                                        }`}
                                    >
                                        <p className="font-semibold text-zinc-950">{template.name}</p>
                                        <p className="mt-1 text-xs text-zinc-600">
                                            {template.postgraduate.title} · {template._count.indicators} indicadores
                                        </p>
                                    </button>
                                ))}
                            </div>
                        )}
                    </section>

                    <section>
                        <h2 className="text-sm font-semibold uppercase text-zinc-500">3. Fecha de vencimiento</h2>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(event) => setDueDate(event.target.value)}
                            className="mt-3 h-11 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900"
                        />
                    </section>

                    <section>
                        <h2 className="text-sm font-semibold uppercase text-zinc-500">4. Usuarios asignados</h2>
                        {users.length === 0 ? (
                            <p className="mt-3 text-sm text-zinc-500">No hay usuarios aprobados para asignar.</p>
                        ) : (
                            <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                {users.map((user) => (
                                    <label
                                        key={user.id}
                                        className="flex cursor-pointer items-center gap-3 border border-zinc-200 bg-white px-3 py-2 transition hover:border-zinc-400"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.has(user.id)}
                                            onChange={() => toggleUser(user.id)}
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
                        )}
                    </section>

                    <div className="flex items-center justify-end gap-3 border-t border-zinc-200 pt-6">
                        <Link
                            href="/app/admin/assignments"
                            className="inline-flex h-11 items-center rounded-md border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="button"
                            disabled={!canSubmit || saving}
                            onClick={handleSubmit}
                            className="inline-flex h-11 items-center gap-2 rounded-md bg-sky-700 px-5 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <FiCheck className="size-4" />
                            {saving ? "Creando..." : "Crear asignación"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
