import { TenantStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma/client";

interface UpdateTenantStatusInput {
  tenantId: string;
  status: TenantStatus;
}

export async function updateTenantStatus({
  tenantId,
  status,
}: UpdateTenantStatusInput) {
  const tenant =
    await prisma.tenant.findUnique({
      where: {
        id: tenantId,
      },
    });

  if (!tenant) {
    throw new Error(
      "Tenant not found.",
    );
  }

  if (tenant.status === status) {
    return tenant;
  }

  const updatedTenant =
    await prisma.tenant.update({
      where: {
        id: tenantId,
      },
      data: {
        status,
      },
    });

  return updatedTenant;
}