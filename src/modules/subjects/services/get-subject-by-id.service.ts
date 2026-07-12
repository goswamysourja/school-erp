import { prisma } from "@/lib/prisma/client";

export async function getSubjectById(
  id: string
) {
  return prisma.subject.findUnique({
    where: {
      id,
    },
  });
}