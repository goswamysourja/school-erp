import { prisma } from "@/lib/prisma/client";

export async function getSubjectTenants() {
  return prisma.tenant.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}