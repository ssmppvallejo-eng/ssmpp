import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type LegalPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-zinc-200 py-8 first:border-0 first:pt-0">
      <h2 className="text-xl font-semibold tracking-tight text-zinc-950">{title}</h2>
      <div className="mt-4 space-y-4 text-[15px] leading-7 text-zinc-600">{children}</div>
    </section>
  );
}

export default function LegalPage({ eyebrow, title, description, children }: LegalPageProps) {
  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-5 py-4 sm:px-8">
          <Link href="/landing" className="flex items-center gap-3">
            <Image src="/logo.svg" alt="Vallejo" width={44} height={44} className="size-11" />
            <span className="text-sm font-semibold leading-5">
              SICVPP-BUAP
              <span className="block font-normal text-zinc-500">Pertinencia de posgrados</span>
            </span>
          </Link>
          <Link
            href="/landing"
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-semibold transition hover:border-sky-700 hover:text-sky-800"
          >
            Volver al inicio
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">{eyebrow}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-5 text-lg leading-8 text-zinc-600">{description}</p>
          <p className="mt-4 text-sm text-zinc-500">Última actualización: 24 de septiembre de 2026</p>
        </div>

        <article className="mt-10 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm sm:p-10">
          {children}
        </article>
      </div>

      <footer className="border-t border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-5 py-7 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© 2026 SICVPP-BUAP</p>
          <nav className="flex gap-5" aria-label="Información legal">
            <Link href="/privacidad" className="hover:text-sky-800">Privacidad</Link>
            <Link href="/terminos" className="hover:text-sky-800">Términos</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
