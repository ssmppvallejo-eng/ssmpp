import { prisma } from '../../../../lib/prima';
import { authOptions } from '../../../../lib/auth';
import { getServerSession } from 'next-auth';

export async function GET (params) {
    try{
        const session = await getServerSession(authOptions);
        console.log(session);
        if (!session) {
            return new Response(
                JSON.stringify({ message: "Unauthorized" }),
                {
                status: 401,
                headers: { "Content-Type": "application/json" }
                }
            );
        }

        switch(session.user.role){
            case 'ESTUDIANTE':
               const dbAssignment = await prisma.userAssignTo.findMany({
                    where: {
                        userId: session.user.id,
                    },
                    include: {
                        assignment: {
                        select: {
                            assignmentDate: true,
                            submissionDate: true,
                            status: true,

                            dimension: {
                                select: {
                                    code: true,
                                    title: true,
                                    description: true,
                                },
                            },
                        },
                        },
                    },
                });
                
                let assignments = [];

                if(dbAssignment.length){
                    
                    assignments = dbAssignment.map((ass) => {
                        return {
                            assignmentId: ass.assignmentId,
                            title: ass.assignment.dimension.title,
                            index: ass.assignment.dimension.code,
                            description: ass.assignment?.dimension?.description ?? "",
                            status: ass.assignment.status, 
                            assignmentDate: ass.assignment.assignmentDate,
                            submissionDate: ass.assignment.submissionDate

                        };
                    });

                }
 
            return new Response(
            JSON.stringify(
                    assignments
                ),
                {
                    status: 200,
                    headers: { "Content-Type": "application/json" },
                }
            );


            default:
                return new Response("Forbidden", { status: 403 });
        }


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
