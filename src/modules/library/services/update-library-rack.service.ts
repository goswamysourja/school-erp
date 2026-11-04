
import { prisma } from "@/lib/prisma/client";

interface UpdateLibraryRackInput {
  id: string;
  tenantId: string;
  rackNumber?: string;
  description?: string | null;
  location?: string | null;
}

export async function updateLibraryRack(
  input: UpdateLibraryRackInput,
) {
  const rack = await prisma.libraryRack.findFirst({
    where: {
      id: input.id,
      tenantId: input.tenantId,
    },
  });

  if (!rack) {
    throw new Error("Rack not found in this institution.");
  }

  const data: {
    rackNumber?: string;
    description?: string | null;
    location?: string | null;
  } = {};

  if (input.rackNumber !== undefined) {
    const rackNumber = input.rackNumber.trim();

    if (!rackNumber) {
      throw new Error("Rack number cannot be empty.");
    }

    const existingRack = await prisma.libraryRack.findFirst({
      where: {
        tenantId: input.tenantId,
        rackNumber,
        NOT: {
          id: input.id,
        },
      },
    });

    if (existingRack) {
      throw new Error(
        "A rack with this number already exists in this institution.",
      );
    }

    data.rackNumber = rackNumber;
  }

  if (input.description !== undefined) {
    data.description = input.description?.trim() || null;
  }

  if (input.location !== undefined) {
    data.location = input.location?.trim() || null;
  }

  if (Object.keys(data).length === 0) {
    throw new Error("At least one field must be provided.");
  }

  return prisma.libraryRack.update({
    where: {
      id: rack.id,
    },
    data,
  });
}
