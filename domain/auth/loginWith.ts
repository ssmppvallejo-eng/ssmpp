import { prisma } from "../../lib/prisma";

export async function login_with_google(user: any) {
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email: user.email }
        });

        if (!existingUser) {
            console.log('Adding a New User');

            return await prisma.user.create({
                data: {
                    email: user.email,
                    image: user.image ?? undefined,
                    name: user.name,
                },
            });

        }
        console.log(`User ${user.email} has signed in`);
        return existingUser;
    }
    catch (error) {
        console.error('ERROR: Signin with Google:', error);
        return false;
    }
}
