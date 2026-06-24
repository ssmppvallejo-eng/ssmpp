"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiChevronDown, FiLogIn, FiMenu, FiX } from "react-icons/fi";

const researchItems = [
    { label: "Artículos", href: "#articulos" },
    { label: "Capítulos de libros", href: "#capitulos" },
];

const resourcesItems = [
    { label: "Tesauros", href: "#tesauros" },
    { label: "Repositorios de tesis", href: "#repositorios" },
    { label: "Video tutoriales", href: "#tutoriales" },
    { label: "Herramientas de IA", href: "#ia" },
    { label: "Indicadores y estadísticas", href: "#indicadores" },
];

function Dropdown({ label, items }: { label: string; items: { label: string; href: string }[] }) {
    return (
        <div className="group relative">
            <a href={items[0].href} className="flex items-center gap-1 py-6 transition hover:text-sky-800">
                {label}<FiChevronDown className="size-4 transition group-hover:rotate-180" />
            </a>
            <div className="invisible absolute left-1/2 top-full w-64 -translate-x-1/2 border border-zinc-200 bg-white p-2 opacity-0 transition group-hover:visible group-hover:opacity-100">
                {items.map((item) => (
                    <a key={item.href} href={item.href} className="block rounded-md px-3 py-2.5 text-sm text-zinc-600 transition hover:bg-sky-50 hover:text-sky-800">
                        {item.label}
                    </a>
                ))}
            </div>
        </div>
    );
}

export default function Navbar() {
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 px-5 py-3 backdrop-blur sm:px-8 lg:px-12">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
                <a href="#inicio" className="flex items-center gap-3">
                    <Image src="/logo.svg" alt="Vallejo" width={48} height={48} className="size-12" />
                    <span className="hidden text-sm font-semibold leading-5 sm:block">
                        José Víctor Manuel<br />Vallejo Córdoba
                    </span>
                </a>

                <div className="hidden items-center gap-7 text-sm font-medium text-zinc-600 lg:flex">
                    <a href="#inicio" className="transition hover:text-sky-800">Inicio</a>
                    <a href="#acerca" className="transition hover:text-sky-800">Acerca de mí</a>
                    <Dropdown label="Investigación" items={researchItems} />
                    <Dropdown label="Sitios de interés" items={resourcesItems} />
                    <a href="#contacto" className="transition hover:text-sky-800">Contacto</a>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
                        onClick={() => setMenuOpen((open) => !open)}
                        className="grid size-10 place-items-center rounded-md border border-zinc-300 lg:hidden"
                    >
                        {menuOpen ? <FiX /> : <FiMenu />}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push("/landing/accounts")}
                        className="inline-flex h-10 items-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-sky-800"
                    >
                        <FiLogIn /><span className="hidden sm:inline">Iniciar sesión</span>
                    </button>
                </div>
            </div>

            {menuOpen && (
                <div className="mx-auto mt-3 grid max-w-7xl gap-1 border-t border-zinc-200 pt-3 lg:hidden">
                    {[
                        { label: "Inicio", href: "#inicio" },
                        { label: "Acerca de mí", href: "#acerca" },
                        ...researchItems,
                        ...resourcesItems,
                        { label: "Contacto", href: "#contacto" },
                    ].map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            onClick={() => setMenuOpen(false)}
                            className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-sky-50 hover:text-sky-800"
                        >
                            {item.label}
                        </a>
                    ))}
                </div>
            )}
        </nav>
    );
}
