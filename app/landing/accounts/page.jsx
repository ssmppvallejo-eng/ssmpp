"use client";

import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FiArrowLeft, FiShield, FiUserCheck } from "react-icons/fi";

export default function Accounts() {
  return (
    <main className="min-h-screen bg-stone-50 text-zinc-950">
      <section className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <article className="relative hidden overflow-hidden bg-zinc-950 px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 opacity-20">
            <Image
              src="/logo.svg"
              alt=""
              width={560}
              height={560}
              className="absolute -right-24 top-1/2 size-[560px] -translate-y-1/2"
            />
          </div>

          <Link href="/landing" className="relative inline-flex w-fit items-center gap-2 text-sm font-medium text-zinc-300 transition hover:text-white">
            <FiArrowLeft />
            Volver a la landing
          </Link>

          <div className="relative max-w-2xl">
            <p className="text-sm font-semibold uppercase text-sky-300">
              Sistema de seguimiento académico
            </p>
            <h1 className="mt-5 text-5xl font-semibold leading-tight">
              Acceso seguro para actividades de evaluación
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-300">
              Ingresa con tu cuenta institucional para consultar actividades,
              responder rúbricas y dar seguimiento a evidencias académicas.
            </p>
          </div>

          <div className="relative grid gap-3 border-t border-white/10 pt-6 text-sm text-zinc-300">
            <div className="flex items-center gap-3">
              <FiShield className="size-5 text-sky-300" />
              Autenticación mediante Google
            </div>
            <div className="flex items-center gap-3">
              <FiUserCheck className="size-5 text-sky-300" />
              Acceso limitado a usuarios registrados
            </div>
          </div>
        </article>

        <article className="flex min-h-screen flex-col bg-white px-5 py-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between">
            <Link href="/landing" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-sky-800 lg:hidden">
              <FiArrowLeft />
              Volver
            </Link>
            <div className="ml-auto flex items-center gap-3">
              <Image src="/logo.svg" alt="Logo" width={48} height={48} className="size-12" />
              <span className="hidden text-sm font-semibold leading-5 text-zinc-950 sm:block">
                SSMPP
              </span>
            </div>
          </div>

          <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase text-sky-700">
                Iniciar sesión
              </p>
              <h2 className="mt-3 text-4xl font-semibold leading-tight text-zinc-950">
                Bienvenido al sistema
              </h2>
              <p className="mt-4 text-base leading-7 text-zinc-600">
                Usa tu cuenta de Google autorizada para entrar al panel de actividades.
              </p>
            </div>

            <div className="border border-zinc-200 bg-stone-50 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
              <button
                type="button"
                onClick={() => signIn("google", { callbackUrl: "/app" })}
                className="flex h-12 w-full items-center justify-center gap-3 rounded-md border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-900 transition hover:border-sky-700 hover:text-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-700 focus:ring-offset-2"
              >
                <FcGoogle className="size-6" />
                Continuar con Google
              </button>

              <p className="mt-4 text-center text-xs leading-5 text-zinc-500">
                El acceso depende de que tu correo exista o sea autorizado dentro del sistema.
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-zinc-500">
            © 2026 Sistema de seguimiento académico.
          </p>
        </article>
      </section>
    </main>
  );
}
