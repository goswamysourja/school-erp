import { Prisma, Role } from "@prisma/client";

import { prisma } from "@/lib/prisma/client";

interface ReturnLibraryBookInput {
  tenantId: string;
  loanId: string;
  returnedByUserId: string;
}

const DAY_IN_MS = 24 * 60 * 60 * 1000;

function getUtcDay(date: Date): number {
  return Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
  );
}

export async function returnLibraryBook(
  input: ReturnLibraryBookInput,
) {
  return prisma.$transaction(
    async (tx) => {
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

      const returner = await tx.user.findFirst({
        where: {
          id: input.returnedByUserId,
          tenantId: input.tenantId,
          isActive: true,
          role: {
            in: [Role.ADMIN, Role.STAFF, Role.TEACHER],
          },
        },
      });

      if (!returner) {
        throw new Error(
          "Returning user does not belong to this institution.",
        );
      }

      if (returner.role !== Role.ADMIN) {
        const assignment =
          await tx.libraryStaffAssignment.findUnique({
            where: {
              tenantId_userId: {
                tenantId: input.tenantId,
                userId: returner.id,
              },
            },
            select: {
              isActive: true,
            },
          });

        if (!assignment?.isActive) {
          throw new Error(
            "Only assigned library staff can process returns.",
          );
        }
      }

      const loan = await tx.libraryLoan.findFirst({
        where: {
          id: input.loanId,
          tenantId: input.tenantId,
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
          bookCopy: {
            select: {
              id: true,
              status: true,
            },
          },
        },
      });

      if (!loan) {
        throw new Error(
          "Loan not found in this institution.",
        );
      }

      if (loan.status !== "ACTIVE") {
        throw new Error(
          "Only active loans can be returned.",
        );
      }

      if (loan.bookCopy.status !== "ISSUED") {
        throw new Error(
          "Book copy is not marked as issued.",
        );
      }

      const settings = await tx.librarySettings.upsert({
        where: {
          tenantId: input.tenantId,
        },
        update: {},
        create: {
          tenantId: input.tenantId,
        },
      });

      const returnedAt = new Date();

      const dueDay = getUtcDay(loan.dueAt);
      const returnDay = getUtcDay(returnedAt);

      const overdueDays = Math.max(
        0,
        Math.floor((returnDay - dueDay) / DAY_IN_MS) -
          settings.gracePeriodDays,
      );

      const fineRate = Number(settings.finePerDay);

      const fineAmount =
        Math.round(overdueDays * fineRate * 100) / 100;

      const loanUpdate = await tx.libraryLoan.updateMany({
        where: {
          id: loan.id,
          tenantId: input.tenantId,
          status: "ACTIVE",
        },
        data: {
          status: "RETURNED",
          returnedAt,
          returnedByUserId: returner.id,
          fineAmount,
        },
      });

      if (loanUpdate.count !== 1) {
        throw new Error(
          "Loan is no longer active. Refresh and try again.",
        );
      }

      const copyUpdate = await tx.libraryBookCopy.updateMany({
        where: {
          id: loan.bookCopyId,
          tenantId: input.tenantId,
          status: "ISSUED",
        },
        data: {
          status: "AVAILABLE",
        },
      });

      if (copyUpdate.count !== 1) {
        throw new Error(
          "Book copy status changed unexpectedly. Refresh and try again.",
        );
      }

      return tx.libraryLoan.findUniqueOrThrow({
        where: {
          id: loan.id,
        },
        include: {
          student: {
            select: {
              id: true,
              admissionNumber: true,
              firstName: true,
              lastName: true,
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
        },
      });
    },
    {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    },
  );
}