"use client";
import { useEffect, useState } from "react";
import useDebounce from "../../../hooks/useDebounce";


export default function Descriptor({ descriptor, dropRubric, indicatorId, selected, dispatch }) {
    const [option, setOption] = useState({});
    const debounceDescriptor = useDebounce(option,2000);

    const handleClick = ()=>{
        setOption(
            {
                assignmentIndicatorId:indicatorId,
                descriptorId: descriptor.id, 
                valueAssigned: descriptor.value,
            }
        );

        dispatch({
            type: "SET_DESCRIPTOR",
            payload: {
                assignmentIndicatorId:indicatorId,
                descriptorId: descriptor.id, 
                valueAssigned: descriptor.value,
            }
        });
    }

    useEffect(()=>{
        if(!debounceDescriptor) return;
        
        const apiData = debounceDescriptor;

        console.log(apiData);

    },[debounceDescriptor]);

    return(
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
