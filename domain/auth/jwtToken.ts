import { prisma } from "../../lib/prisma";

export async function get_jwt_info(user: any) {
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
      valid: existingUser.active // Mapping 'active' to 'valid' for the JWT as seen in lib/auth.js
    };

  } catch (error) {
    console.error("ERROR: Setting jwt:", error);
    return null;
  }
}
