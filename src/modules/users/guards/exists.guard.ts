import { User } from "@prisma/client";

import { prisma } from "@/lib/prisma/client";

export async function requireUserExists(
  userId: string,
): Promise<User> {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  return user;
}