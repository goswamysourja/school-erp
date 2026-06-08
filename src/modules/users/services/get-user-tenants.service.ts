import { prisma } from "@/lib/prisma/client";

export async function getUserTenants() {
  return prisma.tenant.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}