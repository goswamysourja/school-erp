import { prisma } from "@/lib/prisma/client";

export async function getUserTenants() {
  return prisma.tenant.findMany({
    where: {
      status: "ACTIVE",
    },
    orderBy: {
      name: "asc",
    },
  });
}