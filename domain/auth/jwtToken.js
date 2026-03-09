import { prisma } from "../../lib/prima";

export async function get_jwt_info(user) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email }
    });

    if (!existingUser) {
      console.log("User not found");
      return null;
    }

    console.log("Existing user: ", existingUser);

    return {
      userId: existingUser.id,
      role: existingUser.role,
      email: existingUser.email,
      active: existingUser.active
    };

  } catch (error) {
    console.error("ERROR: Setting jwt:", error);
    return null;
  }
}
