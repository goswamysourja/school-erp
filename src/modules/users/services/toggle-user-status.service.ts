import { prisma } from "@/lib/prisma/client";

export async function toggleUserStatus(
  id: string
) {
  const user =
    await prisma.user.findUnique({
      where: { id },
    });

  if (!user) {
    throw new Error(
      "User not found"
    );
  }

  return prisma.user.update({
    where: { id },
    data: {
      isActive:
        !user.isActive,
    },
  });
}