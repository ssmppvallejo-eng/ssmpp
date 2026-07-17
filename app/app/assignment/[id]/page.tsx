"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useActivity } from '../../../../providers/ActivitiesProvider';
import {  useStyle } from "../../../../providers/StyleProvider";
import Judgement from '../../../../components/app/activities/Judgement';
import EvaluatorPanel from '../../../../components/app/evaluation/EvaluatorPanel';
import { FiArrowLeft, FiClock, FiSave, FiSend } from "react-icons/fi";
import Link from "next/link";

export default  function AssignmentPage () {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();
    const { data: session } = useSession();
    const [submitMessage, setSubmitMessage] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Un evaluador asignado no responde la rubrica: ve el panel de juicio de valor.
    const isEvaluator = session?.user.role === "EVALUADOR";

    const  {
        loadingActivity,
        activity,
        fetchActivity,
        submitAssignment
    } = useActivity();

    const {
        showNav
    } = useStyle();



    useEffect(()=>{
        showNav();
        if (!isEvaluator) {
            fetchActivity(id);
        }
    }, [fetchActivity, id, showNav, isEvaluator]);

    const handleSubmit = async () => {
        setSubmitting(true);
        setSubmitMessage(null);

        const result = await submitAssignment();

        setSubmitting(false);

        if (result.ok) {
            router.push("/app");
            return;
        }

        setSubmitMessage(result.message || "No se pudo enviar la actividad.");
    };

    if (isEvaluator) {
        return <EvaluatorPanel assignmentId={id} />;
    }

    return(
        <div className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
            <div className="mb-5">
                <Link href="/app" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 transition hover:text-sky-800">
                    <FiArrowLeft />
                    Volver a actividades
                </Link>
            </div>

            {loadingActivity && (
                <section className="rounded-md border border-zinc-200 bg-white p-6">
                    <div className="h-5 w-32 animate-pulse rounded bg-zinc-200" />
                    <div className="mt-5 h-9 w-3/4 animate-pulse rounded bg-zinc-200" />
                    <div className="mt-4 h-5 w-1/2 animate-pulse rounded bg-zinc-100" />
                    <div className="mt-10 h-72 animate-pulse rounded bg-zinc-100" />
                </section>
            )}

            {!loadingActivity && Object.keys(activity).length !== 0 && (
                <section className="overflow-hidden rounded-md border border-zinc-200 bg-white shadow-sm">
                    <header className="border-b border-zinc-200 bg-zinc-950 px-6 py-6 text-white sm:px-8">
                        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                            <div>
                                <p className="text-sm font-semibold uppercase text-sky-300">
                                    Dimensión {activity.Dimension.code}
                                </p>
                                <h1 className="mt-2 text-3xl font-semibold leading-tight">
                                    {activity.Dimension.title}
                                </h1>
                                <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-300">
                                    {activity.Dimension.description || "Revisa cada criterio y selecciona el descriptor que corresponda al programa de posgrado."}
                                </p>
                            </div>

                            <div className="grid gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300">
                                <span className="font-semibold text-white">Estado: {activity.status?.replaceAll("_", " ")}</span>
                                <span className="inline-flex items-center gap-2">
                                    <FiClock className="size-4" />
                                    Entrega pendiente
                                </span>
                            </div>
                        </div>
                    </header>

                    <div className="border-b border-zinc-200 bg-stone-50 px-6 py-4 sm:px-8">
                        <p className="text-sm font-semibold text-zinc-950">
                            Componente {activity.Dimension.Component?.code}. {activity.Dimension.Component?.title}
                        </p>
                    </div>

                    <div className="space-y-6 px-5 py-6 sm:px-8">
                        {activity.Judgement.map(a=>
                            <Judgement key={a.id} jud={a} />
                        )}
                    </div>

                    <footer className="flex flex-col gap-3 border-t border-zinc-200 bg-stone-50 px-5 py-5 sm:flex-row sm:justify-end sm:px-8">
                        {submitMessage && (
                            <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800 sm:mr-auto">
                                {submitMessage}
                            </p>
                        )}
                        <button
                            type="button"
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-5 text-sm font-semibold text-zinc-700 transition hover:border-sky-700 hover:text-sky-800"
                        >
                            <FiSave />
                            Guardar avance
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
                        >
                            <FiSend />
                            {submitting ? "Enviando..." : "Enviar actividad"}
                        </button>
                    </footer>
                </section>
            )}
        </div>

    );
}
