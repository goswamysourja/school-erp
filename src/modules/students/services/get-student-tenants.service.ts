import { prisma } from "@/lib/prisma/client";

export async function getStudentTenants() {
  return prisma.tenant.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}