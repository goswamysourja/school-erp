
import { LibraryLoanStatus, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { authorizeLibraryApiAccess } from "@/modules/library/guards/authorize-library-api.guard";
import { issueLibraryBook } from "@/modules/library/services/issue-library-book.service";
import { getLibraryLoans } from "@/modules/library/services/get-library-loans.service";

export async function GET(request: NextRequest) {
  try {
    const access = await authorizeLibraryApiAccess();

    if (!access.authorized) {
      return NextResponse.json(
        { error: access.error },
        { status: access.status },
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const statusParam = searchParams.get("status");

    if (
      statusParam &&
      !Object.values(LibraryLoanStatus).includes(
        statusParam as LibraryLoanStatus,
      )
    ) {
      return NextResponse.json(
        { error: "Invalid loan status." },
        { status: 400 },
      );
    }

    const overdueParam = searchParams.get("overdueOnly");

    if (
      overdueParam !== null &&
      overdueParam !== "true" &&
      overdueParam !== "false"
    ) {
      return NextResponse.json(
        { error: "overdueOnly must be true or false." },
        { status: 400 },
      );
    }

    const studentId = searchParams.get("studentId");
    const search = searchParams.get("search");

    const loans = await getLibraryLoans({
      tenantId: access.tenantId,
      studentId: studentId?.trim() || undefined,
      status: statusParam
        ? (statusParam as LibraryLoanStatus)
        : undefined,
      overdueOnly: overdueParam === "true",
      search: search?.trim() || undefined,
    });

    return NextResponse.json(loans);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch library loans." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const access = await authorizeLibraryApiAccess();

    if (!access.authorized) {
      return NextResponse.json(
        { error: access.error },
        { status: access.status },
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

    const unsupportedFields = Object.keys(payload).filter(
      (field) => !["studentId", "bookCopyId"].includes(field),
    );

    if (unsupportedFields.length > 0) {
      return NextResponse.json(
        {
          error: "The request contains unsupported fields.",
          fields: unsupportedFields,
        },
        { status: 400 },
      );
    }

    if (
      typeof payload.studentId !== "string" ||
      !payload.studentId.trim()
    ) {
      return NextResponse.json(
        { error: "A valid student ID is required." },
        { status: 400 },
      );
    }

    if (
      typeof payload.bookCopyId !== "string" ||
      !payload.bookCopyId.trim()
    ) {
      return NextResponse.json(
        { error: "A valid book copy ID is required." },
        { status: 400 },
      );
    }

    const loan = await issueLibraryBook({
      tenantId: access.tenantId,
      studentId: payload.studentId.trim(),
      bookCopyId: payload.bookCopyId.trim(),
      issuedByUserId: access.user.id,
    });

    return NextResponse.json(loan, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2034"
    ) {
      return NextResponse.json(
        {
          error:
            "A concurrent library transaction conflicted. Please retry.",
        },
        { status: 409 },
      );
    }

    const message = error instanceof Error ? error.message : "";

    const conflictErrors = [
      "Book copy is not available for issue.",
      "Student has reached the maximum borrowing limit.",
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
      "Issuing user does not belong to this institution.",
      "Issuing teacher is not active in this institution.",
      "Only assigned library staff can issue books.",
      "Active student not found in this institution.",
      "Book copy not found in this institution.",
    ];

    if (validationErrors.includes(message)) {
      return NextResponse.json(
        { error: message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Failed to issue book." },
      { status: 500 },
    );
  }
}
