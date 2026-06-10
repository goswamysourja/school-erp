import { prisma } from "@/lib/prisma/client";
import { Role } from "@prisma/client";

export async function getClassTeachers() {
  return prisma.user.findMany({
    where: {
      role: Role.TEACHER,
      isActive: true,
    },

    orderBy: {
      name: "asc",
    },
  });
}