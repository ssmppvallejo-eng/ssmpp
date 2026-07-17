"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { FiArrowLeft, FiClock, FiLogOut, FiXCircle } from "react-icons/fi";

export default function AccountStatus() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/landing/accounts");
        }
        if (status === "authenticated" && session?.user.accessStatus === "APROBADO") {
            router.replace("/app");
        }
    }, [status, session, router]);

    if (status === "loading" || !session) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-stone-50">
                <p className="text-sm text-zinc-500">Cargando...</p>
            </main>
        );
    }

    const rejected = session.user.accessStatus === "RECHAZADO";

    return (
        <main className="flex min-h-screen flex-col bg-stone-50 px-5 py-6 text-zinc-950 sm:px-8">
            <div className="flex items-center justify-between">
                <Link href="/landing" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-sky-800">
                    <FiArrowLeft />
                    Volver a la landing
                </Link>
                <div className="flex items-center gap-3">
                    <Image src="/logo.svg" alt="Logo" width={48} height={48} className="size-12" />
                    <span className="hidden text-sm font-semibold leading-5 text-zinc-950 sm:block">
                        SSMPP
                    </span>
                </div>
            </div>

            <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
                <div className="border border-zinc-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
                    {rejected ? (
                        <FiXCircle className="size-10 text-red-600" />
                    ) : (
                        <FiClock className="size-10 text-sky-700" />
                    )}

                    <h1 className="mt-5 text-2xl font-semibold leading-tight text-zinc-950">
                        {rejected ? "Acceso denegado" : "Cuenta pendiente de aprobación"}
                    </h1>

                    <p className="mt-4 text-sm leading-6 text-zinc-600">
                        {rejected
                            ? "Tu cuenta fue rechazada y no tiene acceso al sistema. Si crees que se trata de un error, contacta a un administrador."
                            : "Tu cuenta fue registrada correctamente, pero un administrador debe aprobarla antes de que puedas entrar al sistema. Intenta de nuevo más tarde."}
                    </p>

                    <p className="mt-4 text-xs text-zinc-500">
                        Sesión iniciada como <span className="font-semibold text-zinc-700">{session.user.email}</span>
                    </p>

                    <button
                        type="button"
                        onClick={() => signOut({ callbackUrl: "/landing" })}
                        className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-900 transition hover:border-sky-700 hover:text-sky-800"
                    >
                        <FiLogOut className="size-4" />
                        Cerrar sesión
                    </button>
                </div>
            </div>

            <p className="text-center text-xs text-zinc-500">
                © 2026 Sistema de seguimiento académico.
            </p>
        </main>
    );
}
