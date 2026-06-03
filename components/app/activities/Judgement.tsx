import Indicator from "./Indicator";
export default function Judgement ({jud}){

    return(

            <section className="rounded-md border border-zinc-200 bg-white">
                <article className="border-b border-zinc-200 px-5 py-5">
                    <p className="text-sm font-semibold uppercase text-sky-700">
                        Criterio de evaluación
                    </p>
                    <h2 className="mt-2 text-xl font-semibold leading-7 text-zinc-950">
                        Criterio {jud.code}. {jud.title}
                    </h2>

                    <p className="mt-3 max-w-4xl text-sm leading-6 text-zinc-600">
                        Seleccione la opción que corresponda a su programa de posgrado, de acuerdo con su conocimiento sobre el mismo.
                    </p>
                </article>

                <section className="divide-y divide-zinc-100">
                    {
                        jud.Indicators.map(i=>
                            <Indicator key={i.id} ind={i}/>
                        )
                    }

                </section>
            </section>

    );

}
