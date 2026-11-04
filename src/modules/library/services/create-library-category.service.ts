
import { prisma } from "@/lib/prisma/client";

interface CreateLibraryCategoryInput {
  tenantId: string;
  name: string;
  description?: string;
}

export async function createLibraryCategory(
  input: CreateLibraryCategoryInput,
) {
  const name = input.name.trim();
  const description = input.description?.trim() || null;

  if (!name) {
    throw new Error("Category name is required.");
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

  const existingCategory = await prisma.libraryCategory.findUnique({
    where: {
      tenantId_name: {
        tenantId: input.tenantId,
        name,
      },
    },
  });

  if (existingCategory) {
    throw new Error(
      "A category with this name already exists in this institution.",
    );
  }

  return prisma.libraryCategory.create({
    data: {
      tenantId: input.tenantId,
      name,
      description,
    },
  });
}
