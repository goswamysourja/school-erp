import { prisma } from "@/lib/prisma/client";

export async function getStudents() {
  return prisma.student.findMany({
    include: {
      tenant: true,
      class: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
