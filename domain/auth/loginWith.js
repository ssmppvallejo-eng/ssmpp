import { prisma } from "../../lib/prima";

export async function login_with_google (user){
    try{
        const existingUser = await prisma.user.findUnique({
            where:{email: user.email}
        });

        if(!existingUser){
            console.log('Adding a New User');

            return await prisma.user.create({
            data:{
                email: user.email,
                image: user.image ?? undefined,
                name: user.name,
            },
            });
            
        } 
        console.log(`User ${user} have sigin`);
    }
    catch(error){
        console.error('ERROR: Sigin with Google:', error);
        return false; 
    }
}