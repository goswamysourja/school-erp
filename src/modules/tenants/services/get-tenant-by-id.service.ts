import { prisma } from "@/lib/prisma/client";

export async function getTenantById(tenantId: string) {
  const tenant = await prisma.tenant.findUnique({
    where: {
      id: tenantId,
    },
  });

  if (!tenant) {
    throw new Error("Tenant not found.");
  }

  return tenant;
}