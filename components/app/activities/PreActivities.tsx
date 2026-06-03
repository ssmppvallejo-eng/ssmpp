import { FiInbox } from "react-icons/fi";
import { PreActivityItem } from "./PreActivityItem";

export default function PreActivities({ preActivities, loading }) {
    if (loading) {
        return (
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3].map((item) => (
                    <article key={item} className="min-h-56 animate-pulse rounded-md border border-zinc-200 bg-white p-5">
                        <div className="h-4 w-24 rounded bg-zinc-200" />
                        <div className="mt-6 h-6 w-3/4 rounded bg-zinc-200" />
                        <div className="mt-4 h-4 w-full rounded bg-zinc-100" />
                        <div className="mt-2 h-4 w-5/6 rounded bg-zinc-100" />
                        <div className="mt-8 h-10 w-full rounded bg-zinc-100" />
                    </article>
                ))}
            </section>
        );
    }

    return (
        <section>
            {preActivities.length === 0 ? (
                <article className="flex min-h-80 flex-col items-center justify-center rounded-md border border-dashed border-zinc-300 bg-white px-6 py-12 text-center">
                    <span className="grid size-14 place-items-center rounded-md bg-sky-50 text-sky-800">
                        <FiInbox className="size-7" />
                    </span>
                    <h2 className="mt-5 text-xl font-semibold text-zinc-950">
                        No hay actividades asignadas
                    </h2>
                    <p className="mt-2 max-w-md text-sm leading-6 text-zinc-600">
                        Cuando exista una actividad relacionada con tu cuenta, aparecerá en este panel.
                    </p>
                </article>
            ):(
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {preActivities.map(pre =>(
                        <PreActivityItem
                        key={pre.assignmentId}
                        pre={pre}
                    />))}
                </div>
            )}
        </section>
    );
}
