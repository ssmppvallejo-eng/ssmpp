"use client";   
import { useEffect } from 'react';
import { useActivity } from '../../providers/ActivitiesProvider';
import PreActivities from '../../components/app/activities/PreActiviities';

export default function Activities(){
        const  {
            preActivities,
            fetchPreActivities,
            loadingPreActivites
        } = useActivity();
    
        useEffect(() => {
            fetchPreActivities();
        }, []);

        useEffect(() => {
            console.log(preActivities);
        }, [preActivities]);

    return(
        <div>

            {
                !loadingPreActivites &&
                <PreActivities preActivities={preActivities}/>

            }
            
        </div>

    );
}