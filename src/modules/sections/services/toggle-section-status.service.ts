import { prisma } from "@/lib/prisma/client";

interface ToggleSectionStatusInput {
  id: string;
  tenantId: string;
}

export async function toggleSectionStatus(
  input: ToggleSectionStatusInput
) {
  const tenant =
    await prisma.tenant.findUnique({
      where: {
        id: input.tenantId,
      },
    });

  if (!tenant) {
    throw new Error(
      "Tenant not found"
    );
  }

  if (tenant.status !== "ACTIVE") {
    throw new Error(
      "Tenant is inactive"
    );
  }

  const section =
    await prisma.section.findUnique({
      where: {
        id: input.id,
      },
    });

  if (!section) {
    throw new Error(
      "Section not found"
    );
  }

  if (
    section.tenantId !==
    input.tenantId
  ) {
    throw new Error(
      "Section belongs to another tenant"
    );
  }

  return prisma.section.update({
    where: {
      id: section.id,
    },

    data: {
      isActive:
        !section.isActive,
    },

    include: {
      class: true,
    },
  });
}