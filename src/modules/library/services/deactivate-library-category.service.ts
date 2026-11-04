
import { prisma } from "@/lib/prisma/client";

interface DeactivateLibraryCategoryInput {
  id: string;
  tenantId: string;
}

export async function deactivateLibraryCategory(
  input: DeactivateLibraryCategoryInput,
) {
  const category = await prisma.libraryCategory.findFirst({
    where: {
      id: input.id,
      tenantId: input.tenantId,
    },
  });

  if (!category) {
    throw new Error(
      "Category not found in this institution.",
    );
  }

  if (!category.isActive) {
    return category;
  }

  return prisma.libraryCategory.update({
    where: {
      id: category.id,
    },
    data: {
      isActive: false,
    },
  });
}
