export default function Descriptor({ descriptor, dropRubric }) {
   

    return(
        <article className="ring-2 ring-blue-600/60 p-2 pr-6 md:pl-6 bg-gray-100/70 mb-2 md:mb-0 md:bg-white hover:bg-blue-600/5 rounded-2xl w-full md:w-1/4">      
            <article className="flex justify-between md:items-center ">
                <p className="font-semibold">
                    {descriptor.title}
                </p>

            </article>
            {
                dropRubric &&
                <article className="text-sm mt-2">
                    {descriptor.description}
                </article>

            }
        </article>

    );

}
