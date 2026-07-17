"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { FiBookOpen, FiCheck, FiUser, FiX } from "react-icons/fi";

type AccessStatus = "PENDIENTE" | "APROBADO" | "RECHAZADO";

interface ManagedUser {
    id: number;
    email: string;
    name?: string | null;
    image?: string | null;
    role: string;
    accessStatus: AccessStatus;
    postgraduates?: { postgraduate: { id: number; title: string } }[];
}

interface PostgraduateOption {
    id: number;
    title: string;
}

const ROLES = ["ADMINISTRADOR", "ESTUDIANTE", "COORDINADOR", "PROFESOR", "EVALUADOR"];

const STATUS_STYLES: Record<AccessStatus, string> = {
    PENDIENTE: "bg-amber-50 text-amber-800 border-amber-200",
    APROBADO: "bg-emerald-50 text-emerald-800 border-emerald-200",
    RECHAZADO: "bg-red-50 text-red-800 border-red-200",
};

const STATUS_LABELS: Record<AccessStatus, string> = {
    PENDIENTE: "Pendiente",
    APROBADO: "Aprobado",
    RECHAZADO: "Rechazado",
};

export default function UsersManager() {
    const { data: session } = useSession();
    const [users, setUsers] = useState<ManagedUser[]>([]);
    const [postgraduates, setPostgraduates] = useState<PostgraduateOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [savingUserId, setSavingUserId] = useState<number | null>(null);

    const [linkingUser, setLinkingUser] = useState<ManagedUser | null>(null);
    const [linkedIds, setLinkedIds] = useState<Set<number>>(new Set());
    const [savingLinks, setSavingLinks] = useState(false);

    useEffect(() => {
        let cancelled = false;

        Promise.all([
            fetch("/api/users").then((response) => {
                if (!response.ok) throw new Error("No se pudieron obtener los usuarios");
                return response.json();
            }),
            fetch("/api/postgraduates").then((response) => {
                if (!response.ok) throw new Error("No se pudieron obtener los posgrados");
                return response.json();
            }),
        ])
            .then(([userData, postgraduateData]) => {
                if (cancelled) return;
                setUsers(userData);
                setPostgraduates(postgraduateData);
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

    const openLinking = (user: ManagedUser) => {
        setLinkingUser(user);
        setLinkedIds(new Set((user.postgraduates ?? []).map((entry) => entry.postgraduate.id)));
    };

    const toggleLinked = (id: number) => {
        setLinkedIds((current) => {
            const next = new Set(current);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const saveLinks = async () => {
        if (!linkingUser || savingLinks) return;
        setSavingLinks(true);
        setErrorMessage(null);

        try {
            const response = await fetch(`/api/users/${linkingUser.id}/postgraduates`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ postgraduateIds: [...linkedIds] }),
            });
            if (!response.ok) throw new Error("No se pudieron guardar los posgrados del usuario");

            const updated: ManagedUser = await response.json();
            setUsers((current) => current.map((user) => (user.id === updated.id ? updated : user)));
            setLinkingUser(null);
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Error inesperado");
        } finally {
            setSavingLinks(false);
        }
    };

    const updateUser = async (userId: number, changes: { accessStatus?: AccessStatus; role?: string }) => {
        setSavingUserId(userId);
        setErrorMessage(null);
        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(changes),
            });
            if (!response.ok) throw new Error("No se pudo actualizar el usuario");

            const updated: ManagedUser = await response.json();
            setUsers((current) => current.map((user) => (user.id === updated.id ? updated : user)));
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Error inesperado");
        } finally {
            setSavingUserId(null);
        }
    };

    const pendingCount = users.filter((user) => user.accessStatus === "PENDIENTE").length;

    return (
        <div className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
            <header className="mb-8 flex flex-col gap-4 border-b border-zinc-200 pb-6 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase text-sky-700">Administración</p>
                    <h1 className="mt-2 text-3xl font-semibold leading-tight text-zinc-950 sm:text-4xl">
                        Usuarios
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
                        Aprueba o rechaza cuentas registradas y asigna el rol con el que cada usuario trabajará en el sistema.
                    </p>
                </div>
                <div className="rounded-md border border-zinc-200 bg-white px-4 py-3">
                    <p className="text-xs font-semibold uppercase text-zinc-500">Pendientes</p>
                    <p className="mt-1 text-2xl font-semibold text-zinc-950">{pendingCount}</p>
                </div>
            </header>

            {errorMessage && (
                <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                    {errorMessage}
                </div>
            )}

            {loading ? (
                <p className="text-sm text-zinc-500">Cargando usuarios...</p>
            ) : (
                <div className="overflow-x-auto border border-zinc-200 bg-white">
                    <table className="w-full min-w-[720px] text-left text-sm">
                        <thead>
                            <tr className="border-b border-zinc-200 text-xs font-semibold uppercase text-zinc-500">
                                <th className="px-4 py-3">Usuario</th>
                                <th className="px-4 py-3">Acceso</th>
                                <th className="px-4 py-3">Rol</th>
                                <th className="px-4 py-3">Posgrados</th>
                                <th className="px-4 py-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => {
                                const isSelf = user.id === session?.user.id;
                                const saving = savingUserId === user.id;

                                return (
                                    <tr key={user.id} className="border-b border-zinc-100 last:border-b-0">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                {user.image ? (
                                                    <Image
                                                        src={user.image}
                                                        alt=""
                                                        width={36}
                                                        height={36}
                                                        className="size-9 rounded-full"
                                                    />
                                                ) : (
                                                    <span className="flex size-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
                                                        <FiUser className="size-4" />
                                                    </span>
                                                )}
                                                <div>
                                                    <p className="font-semibold text-zinc-950">
                                                        {user.name ?? "Sin nombre"}
                                                        {isSelf && <span className="ml-2 text-xs font-medium text-zinc-400">(tú)</span>}
                                                    </p>
                                                    <p className="text-xs text-zinc-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[user.accessStatus]}`}>
                                                {STATUS_LABELS[user.accessStatus]}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {user.accessStatus === "APROBADO" ? (
                                                <select
                                                    value={user.role}
                                                    disabled={isSelf || saving}
                                                    onChange={(event) => updateUser(user.id, { role: event.target.value })}
                                                    className="h-9 rounded-md border border-zinc-300 bg-white px-2 text-sm text-zinc-900 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-400"
                                                >
                                                    {ROLES.map((role) => (
                                                        <option key={role} value={role}>{role}</option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <span className="text-xs text-zinc-400">—</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                {(user.postgraduates ?? []).map((entry) => (
                                                    <span key={entry.postgraduate.id} className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-800">
                                                        {entry.postgraduate.title}
                                                    </span>
                                                ))}
                                                <button
                                                    type="button"
                                                    disabled={postgraduates.length === 0}
                                                    onClick={() => openLinking(user)}
                                                    title="Vincular posgrados"
                                                    className="inline-flex h-7 items-center gap-1 rounded-md border border-zinc-300 bg-white px-2 text-xs font-semibold text-zinc-600 transition hover:border-sky-700 hover:text-sky-800 disabled:cursor-not-allowed disabled:opacity-40"
                                                >
                                                    <FiBookOpen className="size-3.5" />
                                                    {(user.postgraduates ?? []).length === 0 ? "Vincular" : "Editar"}
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                {user.accessStatus !== "APROBADO" && (
                                                    <button
                                                        type="button"
                                                        disabled={isSelf || saving}
                                                        onClick={() => updateUser(user.id, { accessStatus: "APROBADO" })}
                                                        className="inline-flex h-9 items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        <FiCheck className="size-4" />
                                                        Aprobar
                                                    </button>
                                                )}
                                                {user.accessStatus !== "RECHAZADO" && (
                                                    <button
                                                        type="button"
                                                        disabled={isSelf || saving}
                                                        onClick={() => updateUser(user.id, { accessStatus: "RECHAZADO" })}
                                                        className="inline-flex h-9 items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 text-xs font-semibold text-red-800 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        <FiX className="size-4" />
                                                        Rechazar
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {linkingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/40 p-4">
                    <div className="w-full max-w-lg rounded-md border border-zinc-200 bg-white p-6 shadow-xl">
                        <div className="flex items-center justify-between gap-4">
                            <h2 className="text-lg font-semibold text-zinc-950">
                                Posgrados de {linkingUser.name ?? linkingUser.email}
                            </h2>
                            <button type="button" onClick={() => setLinkingUser(null)} className="text-zinc-400 transition hover:text-zinc-950">
                                <FiX className="size-5" />
                            </button>
                        </div>

                        <div className="mt-5 flex max-h-72 flex-col gap-2 overflow-y-auto">
                            {postgraduates.map((postgraduate) => (
                                <label
                                    key={postgraduate.id}
                                    className="flex cursor-pointer items-center gap-3 rounded-md border border-zinc-200 px-3 py-2.5 transition hover:border-sky-300"
                                >
                                    <input
                                        type="checkbox"
                                        checked={linkedIds.has(postgraduate.id)}
                                        onChange={() => toggleLinked(postgraduate.id)}
                                        className="size-4 accent-sky-700"
                                    />
                                    <span className="text-sm font-medium text-zinc-800">{postgraduate.title}</span>
                                </label>
                            ))}
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setLinkingUser(null)}
                                className="inline-flex h-11 items-center rounded-md border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                disabled={savingLinks}
                                onClick={saveLinks}
                                className="inline-flex h-11 items-center rounded-md bg-sky-700 px-5 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {savingLinks ? "Guardando..." : "Guardar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
