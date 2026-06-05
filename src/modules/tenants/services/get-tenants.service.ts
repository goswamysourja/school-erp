import { prisma } from "@/lib/prisma/client";

export async function getTenants() {
  return prisma.tenant.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}