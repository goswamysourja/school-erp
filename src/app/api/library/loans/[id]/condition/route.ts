
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { authorizeLibraryApiAccess } from "@/modules/library/guards/authorize-library-api.guard";
import { recordLibraryBookCondition } from "@/modules/library/services/record-library-book-condition.service";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(
  request: NextRequest,
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

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request body." },
        { status: 400 },
      );
    }

    if (
      typeof body !== "object" ||
      body === null ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 },
      );
    }

    const payload = body as Record<string, unknown>;

    if (
      Object.keys(payload).some((field) => field !== "condition")
    ) {
      return NextResponse.json(
        { error: "The request contains unsupported fields." },
        { status: 400 },
      );
    }

    if (
      payload.condition !== "LOST" &&
      payload.condition !== "DAMAGED"
    ) {
      return NextResponse.json(
        { error: 'Condition must be either "LOST" or "DAMAGED".' },
        { status: 400 },
      );
    }

    const loan = await recordLibraryBookCondition({
      tenantId: access.tenantId,
      loanId: id.trim(),
      processedByUserId: access.user.id,
      condition: payload.condition,
    });

    return NextResponse.json({
      message:
        payload.condition === "LOST"
          ? "Book marked as lost successfully."
          : "Book marked as damaged successfully.",
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
            "A concurrent library transaction conflicted. Refresh and try again.",
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
      "Only active loans can be marked lost or damaged.",
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

    const forbiddenErrors = [
      "Processing user does not belong to this institution.",
      "Processing teacher is not active in this institution.",
      "Only assigned library staff can process book conditions.",
    ];

    if (forbiddenErrors.includes(message)) {
      return NextResponse.json(
        { error: message },
        { status: 403 },
      );
    }

    if (
      message === "Tenant not found." ||
      message === "Tenant is inactive."
    ) {
      return NextResponse.json(
        { error: message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Failed to update book condition." },
      { status: 500 },
    );
  }
}
