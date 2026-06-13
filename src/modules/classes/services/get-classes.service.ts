import { prisma } from "@/lib/prisma/client";

export async function getClasses() {
  return prisma.class.findMany({
    include: {
      tenant: true,
      classTeacher: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}