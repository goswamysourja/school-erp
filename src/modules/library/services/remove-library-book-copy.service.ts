
import { prisma } from "@/lib/prisma/client";

interface RemoveLibraryBookCopyInput {
  id: string;
  tenantId: string;
}

export async function removeLibraryBookCopy(
  input: RemoveLibraryBookCopyInput,
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

  if (copy.status === "REMOVED") {
    return copy;
  }

  if (copy.status === "LOST") {
    throw new Error(
      "Lost copies must retain their lost status for inventory records.",
    );
  }

  if (copy.status === "ISSUED" || copy.loans.length > 0) {
    throw new Error(
      "A book copy with an active loan cannot be removed.",
    );
  }

  return prisma.libraryBookCopy.update({
    where: {
      id: copy.id,
    },
    data: {
      status: "REMOVED",
      rackId: null,
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
