
import { LibraryCopyStatus, Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma/client";

interface UpdateLibraryBookCopyInput {
  id: string;
  tenantId: string;
  rackId?: string | null;
  purchaseDate?: string | null;
  purchasePrice?: number | null;
  notes?: string | null;
  status?: LibraryCopyStatus;
}

export async function updateLibraryBookCopy(
  input: UpdateLibraryBookCopyInput,
) {
  const copy = await prisma.libraryBookCopy.findFirst({
    where: {
      id: input.id,
      tenantId: input.tenantId,
      book: {
        tenantId: input.tenantId,
      },
    },
    include: {
      loans: {
        where: {
          tenantId: input.tenantId,
          status: "ACTIVE",
        },
        select: {
          id: true,
        },
      },
    },
  });

  if (!copy) {
    throw new Error("Book copy not found in this institution.");
  }

  const hasActiveLoan = copy.loans.length > 0;
  const data: Prisma.LibraryBookCopyUncheckedUpdateInput = {};

  if (input.rackId !== undefined) {
    const rackId = input.rackId?.trim() || null;

    if (
      rackId !== copy.rackId &&
      (hasActiveLoan || copy.status === "ISSUED")
    ) {
      throw new Error(
        "The rack assignment cannot be changed while the book copy is issued.",
      );
    }

    if (rackId) {
      const rack = await prisma.libraryRack.findFirst({
        where: {
          id: rackId,
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

    data.rackId = rackId;
  }

  if (input.purchaseDate !== undefined) {
    if (
      input.purchaseDate === null ||
      input.purchaseDate.trim() === ""
    ) {
      data.purchaseDate = null;
    } else {
      const purchaseDate = new Date(input.purchaseDate);

      if (Number.isNaN(purchaseDate.getTime())) {
        throw new Error("Purchase date is invalid.");
      }

      data.purchaseDate = purchaseDate;
    }
  }

  if (input.purchasePrice !== undefined) {
    if (
      input.purchasePrice !== null &&
      (!Number.isFinite(input.purchasePrice) ||
        input.purchasePrice < 0)
    ) {
      throw new Error(
        "Purchase price must be a non-negative number.",
      );
    }

    data.purchasePrice = input.purchasePrice;
  }

  if (input.notes !== undefined) {
    data.notes = input.notes?.trim() || null;
  }

  if (input.status !== undefined) {
    if (
      input.status === "ISSUED" ||
      input.status === "LOST"
    ) {
      throw new Error(
        "Use the circulation operations to issue a book or mark it lost.",
      );
    }

    if (copy.status === "LOST" || copy.status === "REMOVED") {
      throw new Error(
        "Lost or removed copies cannot have their status changed here.",
      );
    }

    if (hasActiveLoan || copy.status === "ISSUED") {
      throw new Error(
        "Issued copies and copies with active loans must be updated through circulation operations.",
      );
    }

    data.status = input.status;
  }

  if (Object.keys(data).length === 0) {
    throw new Error("At least one field must be provided.");
  }

  return prisma.libraryBookCopy.update({
    where: {
      id: copy.id,
    },
    data,
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
