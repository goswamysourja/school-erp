
import { prisma } from "@/lib/prisma/client";

interface DeactivateLibraryRackInput {
  id: string;
  tenantId: string;
}

export async function deactivateLibraryRack(
  input: DeactivateLibraryRackInput,
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

  if (!rack.isActive) {
    return rack;
  }

  const copyCount = await prisma.libraryBookCopy.count({
    where: {
      tenantId: input.tenantId,
      rackId: input.id,
    },
  });

  if (copyCount > 0) {
    throw new Error(
      "Move all book copies to another rack before deactivating this rack.",
    );
  }

  return prisma.libraryRack.update({
    where: {
      id: rack.id,
    },
    data: {
      isActive: false,
    },
  });
}
