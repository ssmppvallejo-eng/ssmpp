"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiLogIn, FiMenu, FiX } from "react-icons/fi";

const navItems = [
    { label: "Inicio", href: "#inicio" },
    { label: "Acerca de mí", href: "#acerca" },
    { label: "Trayectoria", href: "#trayectoria" },
    { label: "Contacto", href: "#contacto" },
];

export default function Navbar (){
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogin = ()=>{
        router.push(`/landing/accounts`)
    }

    return(
        <nav className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 px-5 py-3 backdrop-blur sm:px-8 lg:px-12">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
                <a href="#inicio" className="flex items-center gap-3">
                    <Image src="/logo.svg" alt="Logo" width={48} height={48} className="size-12" />
                    <span className="hidden text-sm font-semibold leading-5 text-zinc-950 sm:block">
                        José Víctor Manuel<br />Vallejo Córdoba
                    </span>
                </a>

                <div className="hidden items-center gap-7 text-sm font-medium text-zinc-600 lg:flex">
                    {navItems.map((item) => (
                        <a key={item.href} href={item.href} className="transition hover:text-sky-800">
                            {item.label}
                        </a>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
                        onClick={() => setMenuOpen((open) => !open)}
                        className="grid size-10 place-items-center rounded-md border border-zinc-300 text-zinc-800 lg:hidden"
                    >
                        {menuOpen ? <FiX /> : <FiMenu />}
                    </button>
                    <button
                        type="button"
                        onClick={handleLogin}
                        className="inline-flex h-10 items-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-sky-800"
                    >
                        <FiLogIn />
                        <span className="hidden sm:inline">Iniciar sesión</span>
                    </button>
                </div>
            </div>
            {menuOpen && (
                <div className="mx-auto mt-3 grid max-w-7xl gap-1 border-t border-zinc-200 pt-3 lg:hidden">
                    {navItems.map((item) => (
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
