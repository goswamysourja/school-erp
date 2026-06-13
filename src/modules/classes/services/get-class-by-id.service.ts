import { prisma } from "@/lib/prisma/client";

export async function getClassById(
  id: string
) {
  return prisma.class.findUnique({
    where: {
      id,
    },
  });
}