
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma/client";
import { authorizeLibraryApiAccess } from "@/modules/library/guards/authorize-library-api.guard";

export async function GET() {
  try {
    const access = await authorizeLibraryApiAccess();

    if (!access.authorized) {
      return NextResponse.json(
        { error: access.error },
        { status: access.status },
      );
    }

    const tenantId = access.tenantId;
    const now = new Date();

    const [
      totalTitles,
      totalCopies,
      availableCopies,
      issuedCopies,
      lostCopies,
      damagedCopies,
      maintenanceCopies,
      removedCopies,
      activeLoans,
      overdueLoans,
      returnedLoans,
      activeCategories,
      activeRacks,
      financialSummary,
    ] = await Promise.all([
      prisma.libraryBook.count({
        where: {
          tenantId,
          isActive: true,
        },
      }),

      prisma.libraryBookCopy.count({
        where: {
          tenantId,
          status: { not: "REMOVED" },
        },
      }),

      prisma.libraryBookCopy.count({
        where: {
          tenantId,
          status: "AVAILABLE",
        },
      }),

      prisma.libraryBookCopy.count({
        where: {
          tenantId,
          status: "ISSUED",
        },
      }),

      prisma.libraryBookCopy.count({
        where: {
          tenantId,
          status: "LOST",
        },
      }),

      prisma.libraryBookCopy.count({
        where: {
          tenantId,
          status: "DAMAGED",
        },
      }),

      prisma.libraryBookCopy.count({
        where: {
          tenantId,
          status: "MAINTENANCE",
        },
      }),

      prisma.libraryBookCopy.count({
        where: {
          tenantId,
          status: "REMOVED",
        },
      }),

      prisma.libraryLoan.count({
        where: {
          tenantId,
          status: "ACTIVE",
        },
      }),

      prisma.libraryLoan.count({
        where: {
          tenantId,
          status: "ACTIVE",
          dueAt: {
            lt: now,
          },
        },
      }),

      prisma.libraryLoan.count({
        where: {
          tenantId,
          status: "RETURNED",
        },
      }),

      prisma.libraryCategory.count({
        where: {
          tenantId,
          isActive: true,
        },
      }),

      prisma.libraryRack.count({
        where: {
          tenantId,
          isActive: true,
        },
      }),

      prisma.libraryLoan.aggregate({
        where: {
          tenantId,
        },
        _sum: {
          fineAmount: true,
          finePaidAmount: true,
          replacementCharge: true,
          replacementPaidAmount: true,
        },
      }),
    ]);

    const fineCharged = Number(
      financialSummary._sum.fineAmount ?? 0,
    );

    const finePaid = Number(
      financialSummary._sum.finePaidAmount ?? 0,
    );

    const replacementCharged = Number(
      financialSummary._sum.replacementCharge ?? 0,
    );

    const replacementPaid = Number(
      financialSummary._sum.replacementPaidAmount ?? 0,
    );

    const roundMoney = (amount: number) =>
      Math.round((amount + Number.EPSILON) * 100) / 100;

    return NextResponse.json({
      inventory: {
        totalTitles,
        totalCopies,
        availableCopies,
        issuedCopies,
        lostCopies,
        damagedCopies,
        maintenanceCopies,
        removedCopies,
      },
      circulation: {
        activeLoans,
        overdueLoans,
        returnedLoans,
      },
      organization: {
        activeCategories,
        activeRacks,
      },
      finance: {
        fineCharged: roundMoney(fineCharged),
        finePaid: roundMoney(finePaid),
        outstandingFine: roundMoney(
          Math.max(0, fineCharged - finePaid),
        ),
        replacementCharged: roundMoney(replacementCharged),
        replacementPaid: roundMoney(replacementPaid),
        outstandingReplacement: roundMoney(
          Math.max(0, replacementCharged - replacementPaid),
        ),
        totalOutstanding: roundMoney(
          Math.max(0, fineCharged - finePaid) +
            Math.max(0, replacementCharged - replacementPaid),
        ),
      },
      generatedAt: now.toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch library dashboard statistics." },
      { status: 500 },
    );
  }
}
