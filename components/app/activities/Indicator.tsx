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
    const { assignmentState, assignmentDispatch, saveResponse } = useActivity();
    const descriptorState = assignmentState.descriptors[ind.assignmentIndicatorId];

    const [dropRubric, setDropRubric] = useState(true);
    const toggleAll = () => {
        setDropRubric(prev => !prev);
    }
    const [comment, setComment] = useState(() => descriptorState?.comment ?? '');
    const debounceComment = useDebounce(comment, 1200);

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
                                Adjunte un archivo si el indicador lo requiere.
                            </p>
                            <label
                                htmlFor={`file-upload-${ind.id}`}
                                className="mt-3 flex h-24 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-zinc-300 bg-white px-3 text-center text-sm font-semibold text-zinc-600 transition hover:border-sky-700 hover:text-sky-800"
                            >
                                <FiFileText className="mb-2 size-5" />
                                Seleccionar archivo
                            </label>

                            <input
                                id={`file-upload-${ind.id}`}
                                type="file"
                                className="hidden"
                            />
                        </div>
                    </div>
                </section>
            </div>
        </article>
    );
}
