import { prisma } from "@/lib/prisma/client";

export async function getUsers() {
  const users =
    await prisma.user.findMany({
      include: {
        tenant: true,

        teacher: {
          select: {
            id: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  return users.map((user) => ({
    ...user,

    hasTeacherProfile:
      user.teacher !== null,
  }));
}