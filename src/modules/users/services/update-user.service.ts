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

  if (tenant.status !== "ACTIVE") {
    throw new Error(
      "Tenant is inactive.",
    );
  }

  const user =
    await prisma.user.findUnique({
      where: {
        id,
      },
    });

  if (!user) {
    throw new Error(
      "User not found.",
    );
  }

  if (user.role !== Role.TEACHER) {
    throw new Error(
      "Only teacher users can be managed through this endpoint.",
    );
  }

  if (user.tenantId !== tenantId) {
    throw new Error(
      "User belongs to another tenant.",
    );
  }

  const normalizedPhone =
    phone?.trim();

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