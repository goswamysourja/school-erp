import {
  LibraryPaymentMethod,
  LibraryPaymentType,
  Prisma,
  Role,
} from "@prisma/client";

import { prisma } from "@/lib/prisma/client";

interface RecordLibraryPaymentInput {
  tenantId: string;
  loanId: string;
  receivedByUserId: string;
  type: LibraryPaymentType;
  amount: number;
  method: LibraryPaymentMethod;
  reference?: string;
  notes?: string;
}

export async function recordLibraryPayment(
  input: RecordLibraryPaymentInput,
) {
  if (
    !Number.isFinite(input.amount) ||
    input.amount <= 0 ||
    Math.abs(input.amount * 100 - Math.round(input.amount * 100)) >
      1e-7
  ) {
    throw new Error(
      "Payment amount must be positive and have at most two decimal places.",
    );
  }

  const amount = new Prisma.Decimal(input.amount.toFixed(2));

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

      const receiver = await tx.user.findFirst({
        where: {
          id: input.receivedByUserId,
          tenantId: input.tenantId,
          isActive: true,
          role: {
            in: [Role.ADMIN, Role.STAFF, Role.TEACHER],
          },
        },
      });

      if (!receiver) {
        throw new Error(
          "Payment receiver does not belong to this institution.",
        );
      }

      if (receiver.role !== Role.ADMIN) {
        const assignment =
          await tx.libraryStaffAssignment.findUnique({
            where: {
              tenantId_userId: {
                tenantId: input.tenantId,
                userId: receiver.id,
              },
            },
            select: {
              isActive: true,
            },
          });

        if (!assignment?.isActive) {
          throw new Error(
            "Only assigned library staff can record payments.",
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
        select: {
          id: true,
          status: true,
          fineAmount: true,
          finePaidAmount: true,
          replacementCharge: true,
          replacementPaidAmount: true,
        },
      });

      if (!loan) {
        throw new Error(
          "Loan not found in this institution.",
        );
      }

      const outstandingBalance =
        input.type === LibraryPaymentType.FINE
          ? loan.fineAmount.sub(loan.finePaidAmount)
          : loan.replacementCharge.sub(loan.replacementPaidAmount);

      if (outstandingBalance.lessThanOrEqualTo(0)) {
        throw new Error(
          "There is no outstanding balance for this payment type.",
        );
      }

      if (amount.greaterThan(outstandingBalance)) {
        throw new Error(
          "Payment amount exceeds the outstanding balance.",
        );
      }

      const updatedLoan = await tx.libraryLoan.update({
        where: {
          id: loan.id,
        },
        data:
          input.type === LibraryPaymentType.FINE
            ? {
                finePaidAmount: {
                  increment: amount,
                },
              }
            : {
                replacementPaidAmount: {
                  increment: amount,
                },
              },
      });

      const payment = await tx.libraryPayment.create({
        data: {
          tenantId: input.tenantId,
          loanId: loan.id,
          receivedByUserId: receiver.id,
          type: input.type,
          amount,
          method: input.method,
          reference: input.reference?.trim() || null,
          notes: input.notes?.trim() || null,
        },
        include: {
          receivedBy: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return {
        payment,
        loan: updatedLoan,
        outstandingBalance: outstandingBalance.sub(amount),
      };
    },
    {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    },
  );
}