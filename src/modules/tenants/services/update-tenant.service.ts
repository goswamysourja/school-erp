import { prisma } from "@/lib/prisma/client";

interface UpdateTenantInput {
  tenantId: string;
  name: string;
  slug: string;
}

export async function updateTenant({
  tenantId,
  name,
  slug,
}: UpdateTenantInput) {
  const tenant =
    await prisma.tenant.findUnique({
      where: {
        id: tenantId,
      },
    });

  if (!tenant) {
    throw new Error(
      "Tenant not found."
    );
  }

  const existingTenant =
    await prisma.tenant.findUnique({
      where: {
        slug,
      },
    });

  if (
    existingTenant &&
    existingTenant.id !== tenantId
  ) {
    throw new Error(
      "A tenant with this slug already exists."
    );
  }

  const updatedTenant =
    await prisma.tenant.update({
      where: {
        id: tenantId,
      },
      data: {
        name,
        slug,
      },
    });

  return updatedTenant;
}