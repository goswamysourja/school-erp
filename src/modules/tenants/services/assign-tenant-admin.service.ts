import { prisma } from "@/lib/prisma/client";
import { Role } from "@prisma/client";

interface AssignTenantAdminInput {
  tenantId: string;
  userId: string;
}

export async function assignTenantAdmin({
  tenantId,
  userId,
}: AssignTenantAdminInput) {
  const tenant = await prisma.tenant.findUnique({
    where: {
      id: tenantId,
    },
  });

  if (!tenant) {
    throw new Error("Tenant not found.");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  if (user.role !== Role.ADMIN) {
    throw new Error("Only an ADMIN can be assigned as tenant administrator.");
  }

  if (user.tenantId !== tenantId) {
    throw new Error(
      "Administrator must belong to the same tenant."
    );
  }

  if (!user.isActive) {
    throw new Error(
      "An inactive user cannot be assigned as tenant administrator."
    );
  }

  const updatedTenant = await prisma.tenant.update({
    where: {
      id: tenantId,
    },
    data: {
      adminUserId: userId,
    },
  });

  return updatedTenant;
}