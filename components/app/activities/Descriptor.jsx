export default function Descriptor({ descriptor, dropRubric, indicatorId, selected, dispatch }) {

    return(
        <article onClick={()=>dispatch({
                type: "SET_DESCRIPTOR",
                payload: {
                    assignmentIndicatorId:indicatorId,
                    descriptorId: descriptor.id, 
                    valueAssigned: descriptor.value,
                }
            })}
            className={`
                p-2 pr-6 md:pl-6 mb-2 md:mb-0 rounded-2xl w-full md:w-1/4
                ring-2 transition-all 
                ${selected 
                ? "bg-blue-100 ring-blue-600" 
                : "bg-gray-100/70 md:bg-white ring-blue-600/60 hover:bg-blue-600/5"}
            `}
        >      
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
