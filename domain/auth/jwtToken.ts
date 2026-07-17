import { prisma } from "../../lib/prisma";

export async function get_jwt_info(user: { email?: string | null }) {
  try {
    if (!user.email) {
      return null;
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: user.email }
    });

    if (!existingUser) {
      return null;
    }

    return {
      userId: existingUser.id,
      role: existingUser.role,
      email: existingUser.email,
      accessStatus: existingUser.accessStatus
    };

  } catch (error) {
    console.error("ERROR: Setting jwt:", error);
    return null;
  }
}
