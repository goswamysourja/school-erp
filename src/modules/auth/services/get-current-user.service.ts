import { prisma } from "@/lib/prisma/client";

export async function getCurrentUser(
  userId: string
) {
  const user =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        tenantId: true,
      },
    });

  if (!user) {
    throw new Error(
      "User not found"
    );
  }

  return user;
}