import { prima } from '../../../lib/prima';
import { authOptions } from '../../../lib/auth';
import { getServerSession } from 'next-auth';

export async function GET (params) {
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

        if (!session.user.role) {
            return new Response(
                JSON.stringify({ message: "Forbidden" }),
                {
                status: 403,
                headers: { "Content-Type": "application/json" }
                }
            );
        }

        const users = await prima.user.findMany();

        return new Response(
            JSON.stringify(users),{
                status: 200, 
                headers: { "Content-Type": "application/json" },
            }
        );

    }catch(error){
        console.error('Error at fetching users: ', error);
        return new Response(
            JSON.stringify({
                error: "Error interno del servidor al obtener usuarios",
                details: error.message,
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}