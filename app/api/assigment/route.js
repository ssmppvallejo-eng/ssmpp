import { prisma } from '../../../lib/prima';
import { authOptions } from '../../../lib/auth';
import { getServerSession } from 'next-auth';

export async function GET(params) {
    try{
        const session = getServerSession(authOptions);

        if (!session) {
            return new Response(
                JSON.stringify({ message: "Unauthorized" }),
                {
                status: 401,
                headers: { "Content-Type": "application/json" }
                }
            );
        }

        if(session.user.role==='ADMINISTRADOR'){
            const assigment = await prisma.assigment.findMany();
        }


    }catch(error){

    }
}
