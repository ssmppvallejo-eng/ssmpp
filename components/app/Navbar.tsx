"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { BsListTask } from "react-icons/bs";
import { FiHome, FiLogOut, FiSettings, FiUsers } from "react-icons/fi";

const menuSections = [
    { title: "Actividades", href: "/app", icon: BsListTask },
];

const adminSections = [
    { title: "Usuarios", href: "/app/admin/users", icon: FiUsers },
];

export default function Navbar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const isAdmin = session?.user.role === "ADMINISTRADOR";

    return (
        <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-zinc-200 bg-white px-4 py-5 lg:flex lg:flex-col">
            <Link href="/app" className="flex items-center gap-3 rounded-md px-2 py-2">
                <Image src="/logo.svg" alt="Logo" width={44} height={44} className="size-11" />
                <div>
                    <p className="text-sm font-semibold leading-5 text-zinc-950">SSMPP</p>
                    <p className="text-xs text-zinc-500">Seguimiento académico</p>
                </div>
            </Link>

            <nav className="mt-8 flex flex-1 flex-col gap-1">
                <p className="px-3 text-xs font-semibold uppercase text-zinc-400">Panel</p>
                {menuSections.map((section) => {
                    const Icon = section.icon;
                    const selected = pathname === section.href || pathname.startsWith(`${section.href}/assignment`);

                    return (
                        <Link
                            key={section.href}
                            href={section.href}
                            className={`mt-2 flex h-11 items-center gap-3 rounded-md px-3 text-sm font-semibold transition ${
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
                                    className={`mt-2 flex h-11 items-center gap-3 rounded-md px-3 text-sm font-semibold transition ${
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
                    Landing
                </Link>
                <button
                    type="button"
                    className="mt-1 flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm font-medium text-zinc-400"
                >
                    <FiSettings className="size-4" />
                    Configuración
                </button>
                <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/landing" })}
                    className="mt-1 flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-950"
                >
                    <FiLogOut className="size-4" />
                    Cerrar sesión
                </button>
            </div>
        </aside>
    );
}
