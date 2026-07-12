import { prisma } from "@/lib/prisma/client";

export async function getSubjects() {
  return prisma.subject.findMany({
    include: {
      tenant: true,
      class: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}