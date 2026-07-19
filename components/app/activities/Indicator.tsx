"use client";
import React, { useEffect, useState } from "react";
import Descriptor from "./Descriptor";
import { FiChevronDown, FiChevronUp, FiFileText, FiMessageSquare } from "react-icons/fi";
import { useActivity } from "../../../providers/ActivitiesProvider";
import useDebounce from "../../../hooks/useDebounce";
import { Indicator as IndicatorType } from "../../../src/core/domain/entities/Activities";

interface IndicatorProps {
    ind: IndicatorType;
}

export default function Indicator({ ind }: IndicatorProps) {
    const { assignmentState, assignmentDispatch, saveResponse, activity } = useActivity();
    const descriptorState = assignmentState.descriptors[ind.assignmentIndicatorId];

    const [dropRubric, setDropRubric] = useState(true);
    const toggleAll = () => {
        setDropRubric(prev => !prev);
    }
    const [comment, setComment] = useState(() => descriptorState?.comment ?? '');
    const debounceComment = useDebounce(comment, 1200);

    const [evidence, setEvidence] = useState<{ name: string; url: string } | null>(() =>
        ind.savedResponse?.evidenceUrl
            ? { name: ind.savedResponse.evidenceName ?? "Evidencia", url: ind.savedResponse.evidenceUrl }
            : null
    );
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file || !activity.id || uploading) return;

        setUploading(true);
        setUploadError(null);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("assignmentIndicatorId", String(ind.assignmentIndicatorId));

            const response = await fetch(`/api/assignment/${activity.id}/evidence`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const body = await response.json().catch(() => null);
                throw new Error(body?.message ?? "No se pudo subir la evidencia");
            }

            const uploaded = await response.json();
            setEvidence({ name: uploaded.evidenceName, url: uploaded.evidenceUrl });
        } catch (error) {
            setUploadError(error instanceof Error ? error.message : "Error inesperado");
        } finally {
            setUploading(false);
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setComment(event.target.value);
    }

    useEffect(() => {
        if (!debounceComment) return;
        if (!descriptorState) return;
        if (descriptorState.comment === debounceComment) return;

        assignmentDispatch({
            type: "SET_COMMENT",
            payload: {
                assignmentIndicatorId: ind.assignmentIndicatorId,
                comment: debounceComment
            }
        });

        // Trigger save whenever comment changes, including the selected descriptor
        if (descriptorState.descriptorId) {
            saveResponse(
                ind.assignmentIndicatorId,
                descriptorState.descriptorId,
                descriptorState.valueAssigned || 0,
                debounceComment
            );
        }
    }, [debounceComment, assignmentDispatch, descriptorState, ind.assignmentIndicatorId, saveResponse]);

    return (
        <article className="px-5 py-6">
            <div className="flex flex-col gap-4">
                <div>
                    <span className="inline-flex rounded-md bg-sky-50 px-3 py-1.5 text-sm font-semibold text-sky-800">
                        Indicador {ind.code}
                    </span>
                </div>

                <section>
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <p className="max-w-4xl text-base leading-7 text-zinc-800">
                            {ind.description}
                        </p>

                        <button
                            type="button"
                            onClick={() => toggleAll()}
                            className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-md border border-zinc-300 px-3 text-sm font-semibold text-zinc-700 transition hover:border-sky-700 hover:text-sky-800"
                        >
                            {
                                dropRubric
                                    ? <FiChevronUp />
                                    : <FiChevronDown />
                            }
                            Rúbrica
                        </button>
                    </div>

                    <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        {
                            ind.descriptors?.length > 0 &&
                            ind.descriptors.map(d =>
                                <Descriptor key={d.id} descriptor={d} dropRubric={dropRubric}
                                    assignmentIndicatorId={ind.assignmentIndicatorId} selected={descriptorState?.descriptorId === d.id} dispatch={assignmentDispatch}
                                />
                            )
                        }
                    </div>

                    <div className="mt-6 grid gap-4 rounded-md border border-zinc-200 bg-stone-50 p-4 lg:grid-cols-[minmax(0,1fr)_220px]">
                        <label className="block">
                            <span className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-950">
                                <FiMessageSquare className="size-4 text-sky-700" />
                                Comentario
                            </span>
                            <p className="mt-2 text-sm leading-6 text-zinc-600">
                                En su opinión, ¿cuáles son los elementos fundamentales que deben considerarse para definir la trayectoria académica en el programa de posgrado que coordina?
                            </p>
                            <textarea
                                rows={4}
                                className="mt-3 w-full resize-y rounded-md border border-zinc-300 bg-white p-3 text-sm leading-6 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-sky-700 focus:ring-2 focus:ring-sky-100"
                                onChange={handleChange}
                                placeholder="Escriba aquí su respuesta"
                                value={comment}
                            />
                        </label>

                        <div>
                            <span className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-950">
                                <FiFileText className="size-4 text-sky-700" />
                                Evidencia
                            </span>
                            <p className="mt-2 text-sm leading-6 text-zinc-600">
                                {descriptorState?.descriptorId
                                    ? "Adjunte un archivo si el indicador lo requiere (PDF, imagen u ofimática, máx. 5 MB)."
                                    : "Seleccione primero un descriptor para poder adjuntar evidencia."}
                            </p>

                            {evidence && (
                                <a
                                    href={evidence.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-3 flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
                                >
                                    <FiFileText className="size-4 shrink-0" />
                                    <span className="truncate">{evidence.name}</span>
                                </a>
                            )}

                            <label
                                htmlFor={`file-upload-${ind.assignmentIndicatorId}`}
                                className={`mt-3 flex h-20 flex-col items-center justify-center rounded-md border border-dashed px-3 text-center text-sm font-semibold transition ${
                                    descriptorState?.descriptorId && !uploading
                                        ? "cursor-pointer border-zinc-300 bg-white text-zinc-600 hover:border-sky-700 hover:text-sky-800"
                                        : "cursor-not-allowed border-zinc-200 bg-zinc-50 text-zinc-400"
                                }`}
                            >
                                <FiFileText className="mb-1.5 size-5" />
                                {uploading ? "Subiendo..." : evidence ? "Reemplazar archivo" : "Seleccionar archivo"}
                            </label>

                            <input
                                id={`file-upload-${ind.assignmentIndicatorId}`}
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx"
                                disabled={!descriptorState?.descriptorId || uploading}
                                onChange={handleFileChange}
                                className="hidden"
                            />

                            {uploadError && (
                                <p className="mt-2 text-xs font-medium text-red-700">{uploadError}</p>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </article>
    );
}
