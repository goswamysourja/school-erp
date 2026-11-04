
import { prisma } from "@/lib/prisma/client";

interface UpdateLibraryCategoryInput {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
}

export async function updateLibraryCategory(
  input: UpdateLibraryCategoryInput,
) {
  const name = input.name.trim();
  const description = input.description?.trim() || null;

  if (!name) {
    throw new Error("Category name is required.");
  }

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

  const existingCategory = await prisma.libraryCategory.findFirst({
    where: {
      tenantId: input.tenantId,
      name,
      NOT: {
        id: input.id,
      },
    },
  });

  if (existingCategory) {
    throw new Error(
      "A category with this name already exists in this institution.",
    );
  }

  return prisma.libraryCategory.update({
    where: {
      id: category.id,
    },
    data: {
      name,
      description,
    },
  });
}
