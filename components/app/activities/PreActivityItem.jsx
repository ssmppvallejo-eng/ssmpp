"use client";
import { useRouter } from "next/navigation";


export function PreActivitieItem({ pre }) {
    const router = useRouter();

    const handleClick = (id) =>{
        
        router.push(`app/assignment/${id}`)
    }
    return (
        <article onClick={()=>handleClick(pre.assignmentId)} className="flex flex-col gap-0.5 border-2 p-2 rounded-2xl">
            <span>{pre.title}</span>
            <section>
                <span>{pre.description}</span>
                <span>{pre.status}</span>
            </section>

            <span>{pre.submissionDate}</span>
        </article>
    );
}