import { prisma } from "@/lib/prisma/client";

interface GetSubjectsInput {
  tenantId: string;
}

export async function getSubjects({
  tenantId,
}: GetSubjectsInput) {
  return prisma.subject.findMany({
    where: {
      tenantId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}