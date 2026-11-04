
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { authorizeLibraryApiAccess } from "@/modules/library/guards/authorize-library-api.guard";
import { returnLibraryBook } from "@/modules/library/services/return-library-book.service";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(
  _request: Request,
  context: RouteContext,
) {
  try {
    const access = await authorizeLibraryApiAccess();

    if (!access.authorized) {
      return NextResponse.json(
        { error: access.error },
        { status: access.status },
      );
    }

    const { id } = await context.params;

    if (!id.trim()) {
      return NextResponse.json(
        { error: "A valid loan ID is required." },
        { status: 400 },
      );
    }

    const loan = await returnLibraryBook({
      tenantId: access.tenantId,
      loanId: id.trim(),
      returnedByUserId: access.user.id,
    });

    return NextResponse.json({
      message: "Book returned successfully.",
      loan,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2034"
    ) {
      return NextResponse.json(
        {
          error:
            "A concurrent library transaction conflicted. Please refresh and try again.",
        },
        { status: 409 },
      );
    }

    const message = error instanceof Error ? error.message : "";

    if (message === "Loan not found in this institution.") {
      return NextResponse.json(
        { error: message },
        { status: 404 },
      );
    }

    const conflictErrors = [
      "Only active loans can be returned.",
      "Book copy is not marked as issued.",
      "Loan is no longer active. Refresh and try again.",
      "Book copy status changed unexpectedly. Refresh and try again.",
    ];

    if (conflictErrors.includes(message)) {
      return NextResponse.json(
        { error: message },
        { status: 409 },
      );
    }

    const validationErrors = [
      "Tenant not found.",
      "Tenant is inactive.",
      "Returning user does not belong to this institution.",
      "Returning teacher is not active in this institution.",
      "Only assigned library staff can process returns.",
    ];

    if (validationErrors.includes(message)) {
      return NextResponse.json(
        { error: message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Failed to return book." },
      { status: 500 },
    );
  }
}
