
import { prisma } from "@/lib/prisma/client";

interface GetLibrarySettingsInput {
  tenantId: string;
}

export async function getLibrarySettings(
  input: GetLibrarySettingsInput,
) {
  const tenant = await prisma.tenant.findUnique({
    where: {
      id: input.tenantId,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!tenant) {
    throw new Error("Tenant not found.");
  }

  if (tenant.status !== "ACTIVE") {
    throw new Error("Tenant is inactive.");
  }

  return prisma.librarySettings.upsert({
    where: {
      tenantId: input.tenantId,
    },
    update: {},
    create: {
      tenantId: input.tenantId,
    },
  });
}
