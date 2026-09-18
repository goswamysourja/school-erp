import { prisma } from "@/lib/prisma/client";

interface GetClassesInput {
  tenantId: string;
}

export async function getClasses({
  tenantId,
}: GetClassesInput) {
  return prisma.class.findMany({
    where: {
      tenantId,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
}