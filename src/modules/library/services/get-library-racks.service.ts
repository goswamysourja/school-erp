
import { prisma } from "@/lib/prisma/client";

interface GetLibraryRacksInput {
  tenantId: string;
  activeOnly?: boolean;
}

export async function getLibraryRacks(
  input: GetLibraryRacksInput,
) {
  return prisma.libraryRack.findMany({
    where: {
      tenantId: input.tenantId,
      ...(input.activeOnly ? { isActive: true } : {}),
    },
    include: {
      _count: {
        select: {
          copies: true,
        },
      },
    },
    orderBy: {
      rackNumber: "asc",
    },
  });
}
