
import { prisma } from "@/lib/prisma/client";

interface GetLibraryCategoriesInput {
  tenantId: string;
  activeOnly?: boolean;
}

export async function getLibraryCategories(
  input: GetLibraryCategoriesInput,
) {
  return prisma.libraryCategory.findMany({
    where: {
      tenantId: input.tenantId,
      ...(input.activeOnly ? { isActive: true } : {}),
    },
    orderBy: {
      name: "asc",
    },
  });
}
