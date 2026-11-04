
import { prisma } from "@/lib/prisma/client";

interface CreateLibraryBookInput {
  tenantId: string;
  categoryId: string;
  title: string;
  author?: string;
  publisher?: string;
  isbn?: string;
  edition?: string;
  publicationYear?: number;
  language?: string;
  description?: string;
}

export async function createLibraryBook(
  input: CreateLibraryBookInput,
) {
  const title = input.title.trim();
  const isbn = input.isbn?.trim() || null;

  if (!title) {
    throw new Error("Book title is required.");
  }

  if (
    input.publicationYear !== undefined &&
    (!Number.isInteger(input.publicationYear) ||
      input.publicationYear < 1 ||
      input.publicationYear > new Date().getFullYear())
  ) {
    throw new Error("Publication year is invalid.");
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

  const category = await prisma.libraryCategory.findFirst({
    where: {
      id: input.categoryId,
      tenantId: input.tenantId,
      isActive: true,
    },
    select: {
      id: true,
    },
  });

  if (!category) {
    throw new Error(
      "An active category from this institution is required.",
    );
  }

  if (isbn) {
    const existingBook = await prisma.libraryBook.findFirst({
      where: {
        tenantId: input.tenantId,
        isbn,
      },
      select: {
        id: true,
      },
    });

    if (existingBook) {
      throw new Error(
        "A book with this ISBN already exists in this institution.",
      );
    }
  }

  return prisma.libraryBook.create({
    data: {
      tenantId: input.tenantId,
      categoryId: category.id,
      title,
      author: input.author?.trim() || null,
      publisher: input.publisher?.trim() || null,
      isbn,
      edition: input.edition?.trim() || null,
      publicationYear: input.publicationYear ?? null,
      language: input.language?.trim() || null,
      description: input.description?.trim() || null,
    },
    include: {
      category: true,
      _count: {
        select: {
          copies: true,
        },
      },
    },
  });
}
