"use state";
import Descriptor from "./Descriptor";
import { useState } from "react";
import { BsCaretDown, BsCaretUp } from "react-icons/bs";
import { FaFileAlt } from "react-icons/fa";
import { useReducer } from "react";
import { useActivity } from "../../../providers/ActivitiesProvider";


export default function Indicator ({ind}){

    const { assignmentState, assignmentDispatch} = useActivity();

    const [dropRubric, setDropRubric] = useState(true);
    const toggleAll = ()=>{
        setDropRubric(prev => !prev);
    }
    console.log(`Indi`, ind);
    console.log(`assign`, assignmentState);
    return( 
        <article className="flex flex-col   gap-3 pt-4 md:pt-0 ">

            <p className="h-fit w-fit text-sm p-1 pt-2 pb-2 bg-blue-600 text-white">
                {ind.code}
            </p>
                
            <article className="">
                <p>
                    {ind.description}
                </p>
                
            </article>

            <article className="inset-shadow-sm rounded-2xl p-4 pl-2 pr-2">
                <article className="flex justify-end items-center border-b-2 border-blue-600/80 ">
                    <button onClick={()=>toggleAll()} className="p-1 pl-4">
                        {
                            dropRubric 
                            ? <BsCaretUp />
                            : <BsCaretDown />
                        }
                    </button>
                </article>

                <article className="flex gap-4 flex-1 justify-between mt-6">
                    {   
                        ind.descriptors?.length > 0 && 
                        ind.descriptors.map(d=>
                            <Descriptor key={d.id} descriptor={d}  dropRubric={dropRubric}
                                indicatorId={ind.id} selected={assignmentState.descriptors?.[ind.id]?.descriptorId===d.id} dispatch={assignmentDispatch}
                            /> 
                        )
                    }
                </article>

                <article className="mt-8">
                    <article className="flex flex-col gap-1" >

                        <span className="font-semibold ">
                            Comentario
                        </span>
                        <p className="">
                            En su opinión, ¿cuáles son los elementos fundamentales que deben considerarse para definir la trayectoria académica en el programa de posgrado que coordina?
                        </p>
                        <textarea
                            rows={3}
                            className="
                                bg-blue-100/60
                                p-2
                                w-full
                                mt-2
                                rounded-2xl
                                focus:outline-none
                                focus:border-2
                                focus:border-blue-500
                            "
                            placeholder="Aquí su respuesta"
                        />

                        <article className="flex mt-2">
                            <label 
                                htmlFor="file-upload"
                                className="flex items-center gap-2 cursor-pointer border px-4 py-2 rounded-lg hover:bg-gray-100"
                            >
                                <FaFileAlt />
                                <span>Evidencia</span>
                            </label>

                            <input
                                id="file-upload"
                                type="file"
                                className="hidden"

                            />
                        </article>

                    </article>
                </article>
            </article>

        </article>
    );
}
