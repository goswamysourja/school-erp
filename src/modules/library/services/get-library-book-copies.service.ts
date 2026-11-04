
import { LibraryCopyStatus, Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma/client";

interface GetLibraryBookCopiesInput {
  tenantId: string;
  bookId?: string;
  rackNumber?: string;
  search?: string;
  status?: LibraryCopyStatus;
}

export async function getLibraryBookCopies(
  input: GetLibraryBookCopiesInput,
) {
  const search = input.search?.trim();
  const rackNumber = input.rackNumber?.trim();

  const conditions: Prisma.LibraryBookCopyWhereInput[] = [];

  if (rackNumber) {
    conditions.push({
      rack: {
        is: {
          rackNumber,
          tenantId: input.tenantId,
        },
      },
    });
  }

  if (search) {
    conditions.push({
      OR: [
        {
          accessionNumber: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          barcode: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          book: {
            is: {
              title: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        },
        {
          book: {
            is: {
              author: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        },
        {
          book: {
            is: {
              isbn: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        },
        {
          rack: {
            is: {
              rackNumber: {
                contains: search,
                mode: "insensitive",
              },
              tenantId: input.tenantId,
            },
          },
        },
      ],
    });
  }

  return prisma.libraryBookCopy.findMany({
    where: {
      tenantId: input.tenantId,
      ...(input.bookId ? { bookId: input.bookId } : {}),
      ...(input.status ? { status: input.status } : {}),
      ...(conditions.length > 0 ? { AND: conditions } : {}),
      book: {
        tenantId: input.tenantId,
      },
    },
    include: {
      book: {
        include: {
          category: true,
        },
      },
      rack: true,
      loans: {
        where: {
          tenantId: input.tenantId,
          status: "ACTIVE",
        },
        select: {
          id: true,
          studentId: true,
          issuedAt: true,
          dueAt: true,
          renewalCount: true,
        },
      },
    },
    orderBy: {
      accessionNumber: "asc",
    },
  });
}
