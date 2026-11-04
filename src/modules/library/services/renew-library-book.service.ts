import { Prisma, Role } from "@prisma/client";

import { prisma } from "@/lib/prisma/client";

interface RenewLibraryBookInput {
  tenantId: string;
  loanId: string;
  renewedByUserId: string;
}

export async function renewLibraryBook(
  input: RenewLibraryBookInput,
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

      const renewingUser = await tx.user.findFirst({
        where: {
          id: input.renewedByUserId,
          tenantId: input.tenantId,
          isActive: true,
          role: {
            in: [Role.ADMIN, Role.STAFF, Role.TEACHER],
          },
        },
      });

      if (!renewingUser) {
        throw new Error(
          "Renewing user does not belong to this institution.",
        );
      }

      if (renewingUser.role !== Role.ADMIN) {
        const assignment =
          await tx.libraryStaffAssignment.findUnique({
            where: {
              tenantId_userId: {
                tenantId: input.tenantId,
                userId: renewingUser.id,
              },
            },
            select: {
              isActive: true,
            },
          });

        if (!assignment?.isActive) {
          throw new Error(
            "Only assigned library staff can renew books.",
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
          "Only active loans can be renewed.",
        );
      }

      if (loan.bookCopy.status !== "ISSUED") {
        throw new Error(
          "Book copy is not marked as issued.",
        );
      }

      const now = new Date();

      if (loan.dueAt.getTime() < now.getTime()) {
        throw new Error(
          "Overdue loans cannot be renewed. Process the return instead.",
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

      if (loan.renewalCount >= settings.renewalLimit) {
        throw new Error(
          "The maximum renewal limit has been reached.",
        );
      }

      const nextDueAt = new Date(loan.dueAt);

      nextDueAt.setUTCDate(
        nextDueAt.getUTCDate() + settings.loanPeriodDays,
      );

      const updated = await tx.libraryLoan.updateMany({
        where: {
          id: loan.id,
          tenantId: input.tenantId,
          status: "ACTIVE",
          renewalCount: {
            lt: settings.renewalLimit,
          },
          dueAt: {
            gte: now,
          },
        },
        data: {
          dueAt: nextDueAt,
          renewalCount: {
            increment: 1,
          },
        },
      });

      if (updated.count !== 1) {
        throw new Error(
          "The loan can no longer be renewed. Refresh and try again.",
        );
      }

      return tx.libraryLoan.findFirstOrThrow({
        where: {
          id: loan.id,
          tenantId: input.tenantId,
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