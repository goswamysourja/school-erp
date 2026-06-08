import { prisma } from "@/lib/prisma/client";

export async function toggleTenantStatus(
  id: string
) {
  const tenant =
    await prisma.tenant.findUnique({
      where: { id },
    });

  if (!tenant) {
    throw new Error(
      "Tenant not found"
    );
  }

  return prisma.tenant.update({
    where: { id },
    data: {
      isActive:
        !tenant.isActive,
    },
  });
}