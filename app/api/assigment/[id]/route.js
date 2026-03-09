import { prisma } from '../../../../lib/prima';
import { authOptions } from '../../../../lib/auth';
import { getServerSession } from 'next-auth';



export async function GET (request, context) {
    const params = await context.params;
    const { id } = params;

    const assigmentId = Number(id);


    try{
        const session = await getServerSession(authOptions);
        
        if (!session) {
            return new Response(
                JSON.stringify({ message: "Unauthorized" }),
                {
                status: 401,
                headers: { "Content-Type": "application/json" }
                }
            );
        }

        const isMyActivity = await prisma.userAssignTo.findUnique({
                where: {
                    assignmentId_userId:{
                        userId: session.user.id,
                        assignmentId: assigmentId
                    }

                },
            }
        );

        if(!isMyActivity){
            return new Response("Forbidden", { status: 403 });
        }

        const dbAssignment = await prisma.assignment.findUnique(
            {
                where:{
                    id: assigmentId,
                },
                include:{
                    dimension: {
                        select: {
                            code: true,
                            title: true,
                            description: true,
                            components:{
                                select:{
                                    id:true, 
                                    code:true,
                                    title:true,
                                    description:true,
                                    dimensionId:true,
                                        
                                }
                            }
                        },
                    },
                    indicators:{
                        select:{
                            indicator:{
                                select:{
                                    id:true, 
                                    code:true, 
                                    description:true,
                                    descriptors:{
                                        select:{
                                            id:true,
                                            title:true,
                                            description:true,
                                            value:true,
                                        }
                                    },
                                    judgement:{
                                            select:{
                                                id:true,
                                                code:true, 
                                                title:true, 
                                                description:true
                                            }
                                    }
                               } 
                            }
                        }
                    }
                }
            }
        )

     

        let assignment = {}

        if(Object.keys(dbAssignment) != 0){
            assignment.assignmentDate= dbAssignment.assignmentDate;
            assignment.submissionDate= dbAssignment.submissionDate;
            assignment.status= dbAssignment.status;
            assignment.Dimension = {
                code: dbAssignment.dimension.code,
                title: dbAssignment.dimension.title,
                description: dbAssignment.dimension.description,
                Component: dbAssignment.dimension.components[0],
            }

            let Judgement = dbAssignment.indicators;
            //assignment.Judgement = Judgement;

            
            assignment.Judgement = Judgement.reduce((acc, item) => {

            const indicator = item.indicator;
            const judgementData = indicator.judgement;

            const judgementId = judgementData.id;
            
            // buscar si ya existe el criterio/judgement
            let judgement = acc.find(j => j.id === judgementId);
                
                if (!judgement) {
                    judgement = {
                        id: judgementData.id,
                        code: judgementData.code,
                        title: judgementData.title,
                        description: judgementData.description,
                        Indicators: []   
                    };

                    acc.push(judgement);
                }

                // agregar indicador dentro del judgement
                judgement.Indicators.push({
                    id: indicator.id,
                    code: indicator.code,
                    description: indicator.description,
                    descriptors: indicator.descriptors
                });

                return acc;

            }, []);

        }

        return new Response(
            JSON.stringify(
                assignment
            ),{
                status:200, 
                headers: { "Content-Type": "application/json" }
            }
        );
    }catch(error){
        console.error("Error at fetching assigments:", error);
        return new Response(
        JSON.stringify({
            error: "Error interno del servidor",
            details: error.message,
        }),
        {
            status: 500,
            headers: { "Content-Type": "application/json" },
        }
        );
    }
}