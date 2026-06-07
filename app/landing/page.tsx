import Navbar from "../../components/landing/Navbar";
import Image from "next/image";

import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { FaComputer, FaUserDoctor } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import {
    PiBooksFill,
    PiCertificateFill,
    PiChalkboardTeacherFill,
    PiTreePalmBold,
} from "react-icons/pi";


const academicGrades = [
    { grade: "Doctorado en Administración", icon: FaUserDoctor },
    { grade: "Maestría en Administración y Gestión de Instituciones Educativas", icon: PiChalkboardTeacherFill },
    { grade: "Licenciatura en Administración Turística", icon: PiTreePalmBold },
    { grade: "Carrera Técnica en Computación y Procesamiento de Datos", icon: FaComputer },
];

const focusAreas = [
    {
        title: "Gestión educativa",
        description: "Acompañamiento académico y administrativo para instituciones de educación superior.",
    },
    {
        title: "Investigación aplicada",
        description: "Análisis de procesos, indicadores y evidencias para fortalecer programas de posgrado.",
    },
    {
        title: "Evaluación institucional",
        description: "Seguimiento de criterios, trayectorias y mejora continua con base documental.",
    },
];

export default function Landing (){
    return(
        <main className="min-h-screen bg-stone-50 text-zinc-950">
            <Navbar />

            <section id="inicio" className="relative overflow-hidden border-b border-zinc-200 bg-white">
                <div className="absolute inset-y-0 right-0 hidden w-1/2 lg:block">
                    <Image
                        src="/logo.svg"
                        alt=""
                        width={420}
                        height={420}
                        className="absolute right-16 top-1/2 size-[420px] -translate-y-1/2 opacity-10"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,#ffffff_0%,rgba(255,255,255,0.74)_34%,rgba(255,255,255,0)_100%)]" />
                </div>

                <div className="relative mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl flex-col justify-between px-5 py-10 sm:px-8 lg:px-12">
                    <div className="grid flex-1 items-center gap-10 py-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
                        <article className="max-w-3xl">
                            <p className="mb-5 text-sm font-semibold uppercase text-sky-700">
                                Trayectoria académica y gestión institucional
                            </p>

                            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.04] text-zinc-950 sm:text-6xl lg:text-7xl">
                                José Víctor Manuel Vallejo Córdoba
                            </h1>

                            <p className="mt-6 max-w-2xl text-xl leading-8 text-zinc-700">
                                Doctor en Administración con enfoque en gestión educativa,
                                evaluación institucional e investigación aplicada a programas
                                de posgrado.
                            </p>

                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <a
                                    href="/landing/accounts"
                                    className="inline-flex h-12 items-center justify-center rounded-md bg-zinc-950 px-6 text-sm font-semibold text-white transition hover:bg-sky-800"
                                >
                                    Iniciar sesión
                                </a>
                                <a
                                    href="#trayectoria"
                                    className="inline-flex h-12 items-center justify-center rounded-md border border-zinc-300 px-6 text-sm font-semibold text-zinc-900 transition hover:border-sky-700 hover:text-sky-800"
                                >
                                    Ver trayectoria
                                </a>
                            </div>
                        </article>

                        <aside className="relative flex min-h-[320px] items-center justify-center lg:min-h-[520px]">
                            <div className="absolute inset-6 border border-zinc-200 bg-stone-100" />
                            <div className="relative grid size-64 place-items-center rounded-full border border-zinc-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)] sm:size-80">
                                <Image src="/logo.svg" alt="Logo" width={224} height={224} className="size-44 sm:size-56" />
                            </div>
                            <div className="absolute bottom-4 right-2 max-w-[220px] border-l-4 border-sky-700 bg-white px-5 py-4 shadow-lg">
                                <p className="text-sm font-semibold text-zinc-950">
                                    Sistema de seguimiento académico
                                </p>
                                <p className="mt-1 text-sm leading-5 text-zinc-600">
                                    Rúbricas, indicadores y evidencias para procesos de evaluación.
                                </p>
                            </div>
                        </aside>
                    </div>

                    <div className="grid gap-4 border-t border-zinc-200 pt-5 md:grid-cols-[auto_1fr] md:items-center">
                        <div className="flex gap-3">
                            <a
                                href="https://www.linkedin.com/in/jvmvallejo/"
                                aria-label="LinkedIn"
                                target="_blank"
                                className="grid size-11 place-items-center rounded-md border border-zinc-300 bg-white text-zinc-800 transition hover:border-sky-700 hover:text-sky-800"
                            >
                                <FaLinkedinIn />
                            </a>
                            <a
                                href="#contacto"
                                aria-label="Correo electrónico"
                                className="grid size-11 place-items-center rounded-md border border-zinc-300 bg-white text-zinc-800 transition hover:border-sky-700 hover:text-sky-800"
                            >
                                <MdEmail />
                            </a>
                            <a
                                href="#"
                                aria-label="Facebook"
                                target="_blank"
                                className="grid size-11 place-items-center rounded-md border border-zinc-300 bg-white text-zinc-800 transition hover:border-sky-700 hover:text-sky-800"
                            >
                                <FaFacebookF />
                            </a>
                        </div>
                        <p className="text-sm leading-6 text-zinc-600">
                            Administración, educación superior, investigación y mejora continua.
                        </p>
                    </div>
                </div>
            </section>

            <section id="acerca" className="border-b border-zinc-200 bg-stone-50 px-5 py-16 sm:px-8 lg:px-12">
                <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
                    <div>
                        <p className="text-sm font-semibold uppercase text-sky-700">Acerca de mí</p>
                        <h2 className="mt-3 text-3xl font-semibold leading-tight text-zinc-950 sm:text-4xl">
                            Experiencia enfocada en instituciones académicas
                        </h2>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        {focusAreas.map((area) => (
                            <article key={area.title} className="border border-zinc-200 bg-white p-5">
                                <PiBooksFill className="mb-5 size-7 text-sky-700" />
                                <h3 className="text-base font-semibold text-zinc-950">{area.title}</h3>
                                <p className="mt-3 text-sm leading-6 text-zinc-600">{area.description}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section id="trayectoria" className="bg-zinc-950 px-5 py-16 text-white sm:px-8 lg:px-12">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                        <div>
                            <p className="text-sm font-semibold uppercase text-sky-300">Trayectoria</p>
                            <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
                                Grados académicos
                            </h2>
                        </div>
                        <p className="max-w-2xl text-sm leading-6 text-zinc-300">
                            Formación orientada a la administración, gestión educativa,
                            turismo, tecnologia y procesos institucionales.
                        </p>
                    </div>

                    <div className="mt-10 grid gap-4 md:grid-cols-2">
                        {academicGrades.map((item) => {
                            const Icon = item.icon;
                            return (
                                <article
                                    key={item.grade}
                                    className="group flex min-h-36 items-center gap-5 border border-white/15 bg-white/5 p-5 transition hover:border-sky-300 hover:bg-white"
                                >
                                    <span className="grid size-14 shrink-0 place-items-center rounded-md bg-sky-300 text-zinc-950">
                                        <Icon className="size-7" />
                                    </span>
                                    <h3 className="text-lg font-semibold leading-7 text-white transition group-hover:text-zinc-950">
                                        {item.grade}
                                    </h3>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section id="contacto" className="bg-white px-5 py-14 sm:px-8 lg:px-12">
                <div className="mx-auto flex max-w-7xl flex-col gap-6 border-y border-zinc-200 py-8 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <span className="grid size-12 place-items-center rounded-md bg-sky-100 text-sky-800">
                            <PiCertificateFill className="size-7" />
                        </span>
                        <div>
                            <h2 className="text-xl font-semibold text-zinc-950">
                                Acceso al sistema de evaluación
                            </h2>
                            <p className="mt-1 text-sm text-zinc-600">
                                Ingreso reservado para usuarios con actividades asignadas.
                            </p>
                        </div>
                    </div>
                    <a
                        href="/landing/accounts"
                        className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-sky-800"
                    >
                        Iniciar sesión
                    </a>
                </div>
            </section>

            <footer className="border-t border-zinc-200 bg-zinc-950 px-5 py-8 text-white sm:px-8 lg:px-12">
                <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm font-semibold">
                            José Víctor Manuel Vallejo Córdoba
                        </p>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-400">
                            Gestión educativa, evaluación institucional e investigación aplicada.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 text-sm text-zinc-400 sm:flex-row sm:items-center sm:gap-6">
                        <a href="#inicio" className="transition hover:text-white">Inicio</a>
                        <a href="#trayectoria" className="transition hover:text-white">Trayectoria</a>
                        <a href="#contacto" className="transition hover:text-white">Contacto</a>
                        <span className="text-zinc-500">© 2026</span>
                    </div>
                </div>
            </footer>
        </main>
    );
}
