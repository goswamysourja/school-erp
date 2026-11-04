
import { prisma } from "@/lib/prisma/client";

interface CreateLibraryBookCopyInput {
  tenantId: string;
  bookId: string;
  accessionNumber: string;
  barcode?: string;
  rackId?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  notes?: string;
}

export async function createLibraryBookCopy(
  input: CreateLibraryBookCopyInput,
) {
  const accessionNumber = input.accessionNumber.trim();
  const barcode = input.barcode?.trim() || null;
  const notes = input.notes?.trim() || null;

  if (!accessionNumber) {
    throw new Error("Accession number is required.");
  }

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

  const book = await prisma.libraryBook.findFirst({
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
    const rack = await prisma.libraryRack.findFirst({
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

  const existingAccessionNumber =
    await prisma.libraryBookCopy.findUnique({
      where: {
        tenantId_accessionNumber: {
          tenantId: input.tenantId,
          accessionNumber,
        },
      },
      select: {
        id: true,
      },
    });

  if (existingAccessionNumber) {
    throw new Error(
      "This accession number already exists in this institution.",
    );
  }

  if (barcode) {
    const existingBarcode = await prisma.libraryBookCopy.findUnique({
      where: {
        tenantId_barcode: {
          tenantId: input.tenantId,
          barcode,
        },
      },
      select: {
        id: true,
      },
    });

    if (existingBarcode) {
      throw new Error(
        "This barcode already exists in this institution.",
      );
    }
  }

  return prisma.libraryBookCopy.create({
    data: {
      tenantId: input.tenantId,
      bookId: book.id,
      accessionNumber,
      barcode,
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
}
