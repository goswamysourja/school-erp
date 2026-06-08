import { prisma } from "@/lib/prisma/client";

export async function getTenantById(
  id: string
) {
  return prisma.tenant.findUnique({
    where: {
      id,
    },
  });
}