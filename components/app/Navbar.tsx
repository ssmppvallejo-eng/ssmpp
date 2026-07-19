"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { BsListTask } from "react-icons/bs";
import { FiAward, FiBarChart2, FiClipboard, FiCopy, FiHome, FiLayers, FiLogOut, FiMenu, FiShield, FiUser, FiUsers, FiX } from "react-icons/fi";

const menuSections = [
    { title: "Actividades", href: "/app", icon: BsListTask },
];

const adminSections = [
    { title: "Dashboard", href: "/app/admin/dashboard", icon: FiBarChart2 },
    { title: "Usuarios", href: "/app/admin/users", icon: FiUsers },
    { title: "Asignaciones", href: "/app/admin/assignments", icon: FiClipboard },
    { title: "Instrumento", href: "/app/admin/instrument", icon: FiLayers },
    { title: "Posgrados", href: "/app/admin/postgraduates", icon: FiAward },
    { title: "Plantillas", href: "/app/admin/templates", icon: FiCopy },
];

const ROLE_BADGES: Record<string, { label: string; gradient: string }> = {
    ADMINISTRADOR: { label: "Administrador", gradient: "from-violet-600 to-fuchsia-500" },
    COORDINADOR: { label: "Coordinador", gradient: "from-sky-600 to-cyan-500" },
    PROFESOR: { label: "Profesor", gradient: "from-amber-500 to-orange-500" },
    EVALUADOR: { label: "Evaluador", gradient: "from-emerald-600 to-teal-500" },
    ESTUDIANTE: { label: "Estudiante", gradient: "from-sky-700 to-indigo-600" },
};

function NavContent() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const isAdmin = session?.user.role === "ADMINISTRADOR";
    const roleBadge = session?.user.role ? ROLE_BADGES[session.user.role] : null;

    return (
        <>
            {session?.user && roleBadge && (
                <div className={`mt-5 rounded-lg bg-gradient-to-r ${roleBadge.gradient} p-[1.5px] shadow-sm`}>
                    <div className="flex items-center gap-3 rounded-[7px] bg-white px-3 py-3">
                        {session.user.image ? (
                            <Image
                                src={session.user.image}
                                alt=""
                                width={40}
                                height={40}
                                className="size-10 rounded-full"
                            />
                        ) : (
                            <span className="grid size-10 place-items-center rounded-full bg-zinc-100 text-zinc-400">
                                <FiUser className="size-5" />
                            </span>
                        )}
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-zinc-950">
                                {session.user.name ?? session.user.email}
                            </p>
                            <span className={`mt-1 inline-flex items-center gap-1 rounded-full bg-gradient-to-r ${roleBadge.gradient} px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm`}>
                                <FiShield className="size-3" />
                                {roleBadge.label}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            <nav className="mt-8 flex flex-1 flex-col gap-1 overflow-y-auto">
                <p className="px-3 text-xs font-semibold uppercase text-zinc-400">Panel</p>
                {menuSections.map((section) => {
                    const Icon = section.icon;
                    const selected = pathname === section.href || pathname.startsWith(`${section.href}/assignment`);

                    return (
                        <Link
                            key={section.href}
                            href={section.href}
                            className={`mt-2 flex h-11 shrink-0 items-center gap-3 rounded-md px-3 text-sm font-semibold transition ${
                                selected
                                    ? "bg-sky-50 text-sky-800"
                                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"
                            }`}
                        >
                            <Icon className="size-5" />
                            {section.title}
                        </Link>
                    );
                })}

                {isAdmin && (
                    <>
                        <p className="mt-6 px-3 text-xs font-semibold uppercase text-zinc-400">Administración</p>
                        {adminSections.map((section) => {
                            const Icon = section.icon;
                            const selected = pathname.startsWith(section.href);

                            return (
                                <Link
                                    key={section.href}
                                    href={section.href}
                                    className={`mt-2 flex h-11 shrink-0 items-center gap-3 rounded-md px-3 text-sm font-semibold transition ${
                                        selected
                                            ? "bg-sky-50 text-sky-800"
                                            : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"
                                    }`}
                                >
                                    <Icon className="size-5" />
                                    {section.title}
                                </Link>
                            );
                        })}
                    </>
                )}
            </nav>

            <div className="border-t border-zinc-200 pt-4">
                <Link
                    href="/landing"
                    className="flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-950"
                >
                    <FiHome className="size-4" />
                    Página principal
                </Link>
                <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/landing" })}
                    className="mt-1 flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-950"
                >
                    <FiLogOut className="size-4" />
                    Cerrar sesión
                </button>
            </div>
        </>
    );
}

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <>
            {/* Barra superior movil */}
            <header className="sticky top-0 z-40 flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3 print:hidden lg:hidden">
                <Link href="/app" className="flex items-center gap-2.5">
                    <Image src="/logo.svg" alt="Logo" width={36} height={36} className="size-9" />
                    <div>
                        <p className="text-sm font-semibold leading-4 text-zinc-950">SICVPP-BUAP</p>
                        <p className="text-[11px] text-zinc-500">Pertinencia de posgrados</p>
                    </div>
                </Link>
                <button
                    type="button"
                    onClick={() => setMobileOpen(true)}
                    aria-label="Abrir menú"
                    className="grid size-10 place-items-center rounded-md border border-zinc-300 text-zinc-700 transition hover:border-sky-700 hover:text-sky-800"
                >
                    <FiMenu className="size-5" />
                </button>
            </header>

            {/* Menu movil deslizante */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-zinc-950/40" onClick={() => setMobileOpen(false)} />
                    <div
                        className="absolute inset-y-0 left-0 flex w-80 max-w-[85vw] flex-col bg-white px-4 py-5 shadow-xl"
                        onClick={(event) => {
                            // Cierra el menu al navegar con cualquier enlace interno.
                            if ((event.target as HTMLElement).closest("a")) setMobileOpen(false);
                        }}
                    >
                        <div className="flex items-center justify-between">
                            <Link href="/app" className="flex items-center gap-2.5">
                                <Image src="/logo.svg" alt="Logo" width={36} height={36} className="size-9" />
                                <p className="text-sm font-semibold text-zinc-950">SICVPP-BUAP</p>
                            </Link>
                            <button
                                type="button"
                                onClick={() => setMobileOpen(false)}
                                aria-label="Cerrar menú"
                                className="grid size-10 place-items-center rounded-md text-zinc-500 transition hover:text-zinc-950"
                            >
                                <FiX className="size-5" />
                            </button>
                        </div>
                        <NavContent />
                    </div>
                </div>
            )}

            {/* Navbar de escritorio */}
            <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-zinc-200 bg-white px-4 py-5 print:hidden lg:flex lg:flex-col">
                <Link href="/app" className="flex items-center gap-3 rounded-md px-2 py-2">
                    <Image src="/logo.svg" alt="Logo" width={44} height={44} className="size-11" />
                    <div>
                        <p className="text-sm font-semibold leading-5 text-zinc-950">SICVPP-BUAP</p>
                        <p className="text-xs text-zinc-500">Pertinencia de posgrados</p>
                    </div>
                </Link>
                <NavContent />
            </aside>
        </>
    );
}
