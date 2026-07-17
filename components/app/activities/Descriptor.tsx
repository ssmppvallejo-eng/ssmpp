"use client";
import React, { useEffect, useState } from "react";
import useDebounce from "../../../hooks/useDebounce";
import { Descriptor as DescriptorType } from "../../../src/core/domain/entities/Activities";
import { useActivity } from "../../../providers/ActivitiesProvider";

interface DescriptorProps {
    descriptor: DescriptorType;
    dropRubric: boolean;
    assignmentIndicatorId: number;
    selected: boolean;
    dispatch: any; // We could type this better if we wanted to
}

export default function Descriptor({ descriptor, dropRubric, assignmentIndicatorId, selected, dispatch }: DescriptorProps) {
    const { saveResponse, assignmentState } = useActivity();
    const [option, setOption] = useState<any>(null);
    const debounceDescriptor = useDebounce(option, 2000);

    const handleClick = () => {
        const payload = {
            assignmentIndicatorId,
            descriptorId: descriptor.id,
            valueAssigned: descriptor.value,
        };

        setOption(payload);

        dispatch({
            type: "SET_DESCRIPTOR",
            payload
        });
    }

    useEffect(() => {
        if (!debounceDescriptor) return;

        // Get the current comment from state if it exists
        const currentComment = assignmentState.descriptors[assignmentIndicatorId]?.comment;

        saveResponse(
            debounceDescriptor.assignmentIndicatorId,
            debounceDescriptor.descriptorId,
            debounceDescriptor.valueAssigned,
            currentComment || undefined
        );

    }, [debounceDescriptor, assignmentIndicatorId, saveResponse, assignmentState.descriptors]);

    return (
        <button
            type="button"
            onClick={handleClick}
            className={`
                min-h-28 w-full rounded-md border p-4 text-left transition
                ${selected 
                ? "border-sky-700 bg-sky-50 shadow-sm" 
                : "border-zinc-200 bg-white hover:border-sky-300 hover:bg-sky-50/40"}
            `}
        >
            <article className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold leading-6 text-zinc-950">
                    {descriptor.title}
                </p>
                <span className={`grid size-6 shrink-0 place-items-center rounded-full border text-xs font-semibold ${
                    selected ? "border-sky-700 bg-sky-700 text-white" : "border-zinc-300 text-zinc-500"
                }`}>
                    {descriptor.value}
                </span>
            </article>
            {
                dropRubric &&
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                    {descriptor.description}
                </p>
            }
        </button>
    );
}
