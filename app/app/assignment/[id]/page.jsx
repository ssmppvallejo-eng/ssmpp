"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useActivity } from '../../../../providers/ActivitiesProvider';
import {  useStyle } from "../../../../providers/StyleProvider";
import Judgement from '../../../../components/app/activities/Judgement';

export default  function AssignmentPage () {
    const { id } = useParams(); 

    const  {
        loadingActivity,
        activity,
        fetchActivity
    } = useActivity();

    const {
        hiddeNav
    } = useStyle();



    useEffect(()=>{
        hiddeNav();
        fetchActivity(id);
    }, []);

    useEffect(() => {
        console.log("Activity",activity);
    }, [activity]);


    return(
        <div className="p-6 ">
            {
                !loadingActivity && Object.keys(activity) != 0 && 
                <div className="shadow-xl pb-8">
                <article className="h-6 bg-blue-600 rounded-t-2xl"></article>
                <article className="pr-6 pl-6 pt-2">
                    <section className="flex flex-col gap-2">
                        <p className="text-2xl">
                            Dimension {activity.Dimension.code}. {activity.Dimension.title}
                        </p>
                        <p className="text-xl">
                            Componente {activity.Dimension.Component.code}. {activity.Dimension.Component.title}
                        </p>
                    </section>
                    
                    {
                        activity.Judgement.map(a=>
                            <Judgement key={a.id} jud={a} />
                        )
                    }
                    
                </article>
                </div>
            }
        </div>

    );
}