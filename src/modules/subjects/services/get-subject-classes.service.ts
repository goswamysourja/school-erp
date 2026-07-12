import { prisma } from "@/lib/prisma/client";

export async function getSubjectClasses() {
  return prisma.class.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}