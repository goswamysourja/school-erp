
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma/client";

interface GetLibraryBooksInput {
  tenantId: string;
  search?: string;
  categoryId?: string;
  rackNumber?: string;
  activeOnly?: boolean;
  availableOnly?: boolean;
}

export async function getLibraryBooks(
  input: GetLibraryBooksInput,
) {
  const search = input.search?.trim();
  const rackNumber = input.rackNumber?.trim();

  const conditions: Prisma.LibraryBookWhereInput[] = [];

  if (rackNumber) {
    conditions.push({
      copies: {
        some: {
          tenantId: input.tenantId,
          rack: {
            is: {
              rackNumber,
              tenantId: input.tenantId,
            },
          },
        },
      },
    });
  }

  if (input.availableOnly) {
    conditions.push({
      copies: {
        some: {
          tenantId: input.tenantId,
          status: "AVAILABLE",
        },
      },
    });
  }

  if (search) {
    conditions.push({
      OR: [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          author: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          publisher: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          isbn: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          edition: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          category: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          copies: {
            some: {
              tenantId: input.tenantId,
              accessionNumber: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        },
        {
          copies: {
            some: {
              tenantId: input.tenantId,
              barcode: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        },
        {
          copies: {
            some: {
              tenantId: input.tenantId,
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
          },
        },
      ],
    });
  }

  const books = await prisma.libraryBook.findMany({
    where: {
      tenantId: input.tenantId,
      ...(input.activeOnly ? { isActive: true } : {}),
      ...(input.categoryId
        ? { categoryId: input.categoryId }
        : {}),
      ...(conditions.length > 0 ? { AND: conditions } : {}),
    },
    include: {
      category: true,
      _count: {
        select: {
          copies: true,
        },
      },
    },
    orderBy: [
      { title: "asc" },
      { createdAt: "desc" },
    ],
  });

  if (books.length === 0) {
    return [];
  }

  const availability = await prisma.libraryBookCopy.groupBy({
    by: ["bookId"],
    where: {
      tenantId: input.tenantId,
      status: "AVAILABLE",
      bookId: {
        in: books.map((book) => book.id),
      },
    },
    _count: {
      _all: true,
    },
  });

  const availableCountByBook = new Map(
    availability.map((item) => [
      item.bookId,
      item._count._all,
    ]),
  );

  return books.map((book) => {
    const { _count, ...bookData } = book;

    return {
      ...bookData,
      totalCopies: _count.copies,
      availableCopies: availableCountByBook.get(book.id) ?? 0,
    };
  });
}
