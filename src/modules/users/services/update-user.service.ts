import { Role } from "@prisma/client";

import { prisma } from "@/lib/prisma/client";

interface UpdateUserInput {
  id: string;
  name: string;
  phone?: string;
  tenantId: string;
}

export async function updateUser({
  id,
  name,
  phone,
  tenantId,
}: UpdateUserInput) {
  const tenant = await prisma.tenant.findUnique({
    where: {
      id: tenantId,
    },
  });

  if (!tenant) {
    throw new Error("Tenant not found.");
  }

  if (tenant.status !== "ACTIVE") {
    throw new Error("Tenant is inactive.");
  }

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw new Error("Staff member not found.");
  }

  const isStaff =
    user.role === Role.STAFF ||
    user.role === Role.TEACHER;

  if (!isStaff) {
    throw new Error(
      "Only staff members can be managed through this endpoint.",
    );
  }

  if (user.tenantId !== tenantId) {
    throw new Error(
      "Staff member belongs to another tenant.",
    );
  }

  const normalizedPhone = phone?.trim();

  return prisma.user.update({
    where: {
      id,
    },

    data: {
      name,

      ...(normalizedPhone
        ? {
            phone: normalizedPhone,
          }
        : {}),
    },
  });
}