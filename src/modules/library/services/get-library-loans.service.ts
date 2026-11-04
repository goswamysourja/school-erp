
import { LibraryLoanStatus, Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma/client";

interface GetLibraryLoansInput {
  tenantId: string;
  studentId?: string;
  status?: LibraryLoanStatus;
  overdueOnly?: boolean;
  search?: string;
}

export async function getLibraryLoans(
  input: GetLibraryLoansInput,
) {
  const conditions: Prisma.LibraryLoanWhereInput[] = [];
  const search = input.search?.trim();

  if (input.status) {
    conditions.push({
      status: input.status,
    });
  }

  if (input.overdueOnly) {
    conditions.push({
      status: "ACTIVE",
      dueAt: {
        lt: new Date(),
      },
    });
  }

  if (search) {
    conditions.push({
      OR: [
        {
          student: {
            is: {
              tenantId: input.tenantId,
              admissionNumber: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        },
        {
          student: {
            is: {
              tenantId: input.tenantId,
              firstName: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        },
        {
          student: {
            is: {
              tenantId: input.tenantId,
              lastName: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        },
        {
          bookCopy: {
            is: {
              tenantId: input.tenantId,
              accessionNumber: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        },
        {
          bookCopy: {
            is: {
              tenantId: input.tenantId,
              barcode: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        },
        {
          bookCopy: {
            is: {
              tenantId: input.tenantId,
              book: {
                is: {
                  tenantId: input.tenantId,
                  title: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              },
            },
          },
        },
        {
          bookCopy: {
            is: {
              tenantId: input.tenantId,
              rack: {
                is: {
                  tenantId: input.tenantId,
                  rackNumber: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              },
            },
          },
        },
      ],
    });
  }

  return prisma.libraryLoan.findMany({
    where: {
      tenantId: input.tenantId,
      ...(input.studentId
        ? { studentId: input.studentId }
        : {}),
      ...(conditions.length > 0
        ? { AND: conditions }
        : {}),
      student: {
        tenantId: input.tenantId,
      },
      bookCopy: {
        tenantId: input.tenantId,
        book: {
          tenantId: input.tenantId,
        },
      },
    },
    include: {
      student: {
        select: {
          id: true,
          admissionNumber: true,
          firstName: true,
          lastName: true,
          section: {
            select: {
              id: true,
              name: true,
              class: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
      bookCopy: {
        include: {
          book: {
            include: {
              category: true,
            },
          },
          rack: true,
        },
      },
      issuedByUser: {
        select: {
          id: true,
          name: true,
        },
      },
      returnedByUser: {
        select: {
          id: true,
          name: true,
        },
      },
      payments: {
        where: {
          tenantId: input.tenantId,
        },
        include: {
          receivedBy: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          receivedAt: "desc",
        },
      },
    },
    orderBy: [
      { dueAt: "asc" },
      { issuedAt: "desc" },
    ],
  });
}
