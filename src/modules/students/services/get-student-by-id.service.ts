import { prisma } from "@/lib/prisma/client";

export async function getStudentById(
  id: string
) {
  return prisma.student.findUnique({
    where: {
      id,
    },
    include: {
      tenant: true,
      class: true,
    },
  });
}