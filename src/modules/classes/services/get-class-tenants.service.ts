import { prisma } from "@/lib/prisma/client";

export async function getClassTenants() {
  return prisma.tenant.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}