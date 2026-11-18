
import { prisma } from "@/lib/prisma/client";
import { generateTenantId } from "@/modules/common/services/generate-id.service";

interface CreateLibraryBookCopyInput {
  tenantId: string;
  bookId: string;
  rackId?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  notes?: string;
}

export async function createLibraryBookCopy(
  input: CreateLibraryBookCopyInput,
) {
  const notes = input.notes?.trim() || null;

  if (
    input.purchasePrice !== undefined &&
    (!Number.isFinite(input.purchasePrice) ||
      input.purchasePrice < 0)
  ) {
    throw new Error("Purchase price must be a non-negative number.");
  }

  let purchaseDate: Date | null = null;

  if (input.purchaseDate) {
    purchaseDate = new Date(input.purchaseDate);

    if (Number.isNaN(purchaseDate.getTime())) {
      throw new Error("Purchase date is invalid.");
    }
  }

  return prisma.$transaction(async (tx) => {
    const tenant = await tx.tenant.findUnique({
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

    const book = await tx.libraryBook.findFirst({
      where: {
        id: input.bookId,
        tenantId: input.tenantId,
        isActive: true,
      },
      select: {
        id: true,
      },
    });

    if (!book) {
      throw new Error(
        "An active book from this institution is required.",
      );
    }

    if (input.rackId) {
      const rack = await tx.libraryRack.findFirst({
        where: {
          id: input.rackId,
          tenantId: input.tenantId,
          isActive: true,
        },
        select: {
          id: true,
        },
      });

      if (!rack) {
        throw new Error(
          "An active rack from this institution is required.",
        );
      }
    }

    const accessionNumber = await generateTenantId(tx, {
      tenantId: input.tenantId,
      sequenceKey: "LIBRARY_COPY",
      prefix: "COPY",
      padding: 6,
    });

    return tx.libraryBookCopy.create({
      data: {
        tenantId: input.tenantId,
        bookId: book.id,
        accessionNumber,
        barcode: accessionNumber,
        rackId: input.rackId || null,
        purchaseDate,
        purchasePrice: input.purchasePrice ?? null,
        notes,
      },
      include: {
        book: {
          include: {
            category: true,
          },
        },
        rack: true,
      },
    });
  });
}
