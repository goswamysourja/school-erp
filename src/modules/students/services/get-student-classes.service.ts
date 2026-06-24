import { prisma } from "@/lib/prisma/client";

export async function getStudentClasses() {
  return prisma.class.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}