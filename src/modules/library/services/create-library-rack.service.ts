
import { prisma } from "@/lib/prisma/client";

interface CreateLibraryRackInput {
  tenantId: string;
  rackNumber: string;
  description?: string;
  location?: string;
}

export async function createLibraryRack(
  input: CreateLibraryRackInput,
) {
  const rackNumber = input.rackNumber.trim();
  const description = input.description?.trim() || null;
  const location = input.location?.trim() || null;

  if (!rackNumber) {
    throw new Error("Rack number is required.");
  }

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

  const existingRack = await prisma.libraryRack.findUnique({
    where: {
      tenantId_rackNumber: {
        tenantId: input.tenantId,
        rackNumber,
      },
    },
  });

  if (existingRack) {
    throw new Error(
      "A rack with this number already exists in this institution.",
    );
  }

  return prisma.libraryRack.create({
    data: {
      tenantId: input.tenantId,
      rackNumber,
      description,
      location,
    },
  });
}
