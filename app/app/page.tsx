"use client";   
import { useEffect } from 'react';
import { useActivity } from '../../providers/ActivitiesProvider';
import { useStyle } from '../../providers/StyleProvider';
import PreActivities from '../../components/app/activities/PreActivities';

export default function Activities(){
        const  {
            preActivities,
            fetchPreActivities,
            loadingPreActivites
        } = useActivity();
        const { showNav } = useStyle();
    
        useEffect(() => {
            showNav();
            fetchPreActivities();
        }, [fetchPreActivities, showNav]);

    return(
        <div className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8 lg:px-10">
            <header className="mb-8 flex flex-col gap-4 border-b border-zinc-200 pb-6 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase text-sky-700">Panel de actividades</p>
                    <h1 className="mt-2 text-3xl font-semibold leading-tight text-zinc-950 sm:text-4xl">
                        Mis actividades
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
                        Consulta tus actividades asignadas, revisa fechas de entrega y abre la rúbrica correspondiente.
                    </p>
                </div>
                <div className="rounded-md border border-zinc-200 bg-white px-4 py-3">
                    <p className="text-xs font-semibold uppercase text-zinc-500">Asignadas</p>
                    <p className="mt-1 text-2xl font-semibold text-zinc-950">{preActivities.length}</p>
                </div>
            </header>

            <PreActivities preActivities={preActivities} loading={loadingPreActivites}/>
        </div>
    );
}
