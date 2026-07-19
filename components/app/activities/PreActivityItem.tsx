"use client";
import { useRouter } from "next/navigation";
import { FiArrowRight, FiCalendar, FiClock } from "react-icons/fi";

const statusStyles = {
    PENDIENTE: "bg-amber-50 text-amber-700 ring-amber-200",
    EN_PROCESO: "bg-sky-50 text-sky-800 ring-sky-200",
    ENVIADO: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    EN_REVISION: "bg-violet-50 text-violet-700 ring-violet-200",
    COMPLETADO: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    NO_COMPLETADO: "bg-red-50 text-red-700 ring-red-200",
};

function formatDate(dateValue) {
    if (!dateValue) return "Sin fecha";

    return new Intl.DateTimeFormat("es-MX", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(dateValue));
}

export function PreActivityItem({ pre }) {
    const router = useRouter();

    const handleClick = (id) =>{
        router.push(`/app/assignment/${id}`)
    }

    const statusClass = statusStyles[pre.status] ?? "bg-zinc-100 text-zinc-700 ring-zinc-200";

    return (
        <article
            onClick={()=>handleClick(pre.assignmentId)}
            className="group flex min-h-64 cursor-pointer flex-col justify-between rounded-md border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-lg"
        >
            <div>
                <div className="flex items-start justify-between gap-4">
                    <span className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-600">
                        Dimensión {pre.index}
                    </span>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusClass}`}>
                        {pre.status?.replaceAll("_", " ")}
                    </span>
                </div>

                <h2 className="mt-5 text-xl font-semibold leading-7 text-zinc-950">
                    {pre.title}
                </h2>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-600">
                    {pre.description || "Esta actividad no tiene descripción registrada."}
                </p>
            </div>

            <div className="mt-6 space-y-3 border-t border-zinc-100 pt-4">
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                    <FiCalendar className="size-4 text-zinc-400" />
                    Asignada: {formatDate(pre.assignmentDate)}
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                    <FiClock className="size-4 text-zinc-400" />
                    Entrega: {formatDate(pre.submissionDate)}
                </div>
                <div className="flex items-center justify-between pt-2 text-sm font-semibold text-sky-800">
                    Abrir rúbrica
                    <FiArrowRight className="size-4 transition group-hover:translate-x-1" />
                </div>
            </div>
        </article>
    );
}
