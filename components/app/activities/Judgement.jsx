import Indicator from "./Indicator";
export default function Judgement ({jud}){

    return(

            <section className="mt-4 flex flex-col gap-4 ring ring-black/10 rounded-2xl pr-4 pl-4 pt-6 pb-8 mb-8">
                <article className="flex flex-col gap-2 mb-2">
                    <p className="text-lg">
                        Criterio {jud.code}. {jud.title}
                    </p>

                    <p className="text-base font-semibold">
                        Indicación
                    </p>

                    <p>
                        Seleccione la opción que corresponda a su programa de posgrado, de acuerdo con su conocimiento sobre el mismo.
                    </p>
                </article>

                <section className="flex flex-col md:border-t-2  md:border-blue-600 gap-7 pt-4 pb-4">
                    {
                        jud.Indicators.map(i=>
                            <Indicator key={i.id} ind={i}/>
                        )
                    }

                </section>
            </section>

    );

}