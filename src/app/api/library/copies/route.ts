
import { LibraryCopyStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { authorizeLibraryApiAccess } from "@/modules/library/guards/authorize-library-api.guard";
import { createLibraryBookCopy } from "@/modules/library/services/create-library-book-copy.service";
import { getLibraryBookCopies } from "@/modules/library/services/get-library-book-copies.service";

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
      !Object.values(LibraryCopyStatus).includes(
        statusParam as LibraryCopyStatus,
      )
    ) {
      return NextResponse.json(
        { error: "Invalid book copy status." },
        { status: 400 },
      );
    }

    const copies = await getLibraryBookCopies({
      tenantId: access.tenantId,
      bookId: searchParams.get("bookId") || undefined,
      rackNumber: searchParams.get("rackNumber") || undefined,
      search: searchParams.get("search") || undefined,
      status: statusParam
        ? (statusParam as LibraryCopyStatus)
        : undefined,
    });

    return NextResponse.json(copies);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch book copies." },
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

    if (
      typeof payload.bookId !== "string" ||
      !payload.bookId.trim()
    ) {
      return NextResponse.json(
        { error: "A valid book ID is required." },
        { status: 400 },
      );
    }

    if (
      typeof payload.accessionNumber !== "string" ||
      !payload.accessionNumber.trim()
    ) {
      return NextResponse.json(
        { error: "A valid accession number is required." },
        { status: 400 },
      );
    }

    const stringFields = [
      "barcode",
      "rackId",
      "purchaseDate",
      "notes",
    ] as const;

    for (const field of stringFields) {
      if (
        payload[field] !== undefined &&
        payload[field] !== null &&
        typeof payload[field] !== "string"
      ) {
        return NextResponse.json(
          { error: `${field} must be a string.` },
          { status: 400 },
        );
      }
    }

    if (
      payload.purchasePrice !== undefined &&
      payload.purchasePrice !== null &&
      (typeof payload.purchasePrice !== "number" ||
        !Number.isFinite(payload.purchasePrice))
    ) {
      return NextResponse.json(
        { error: "Purchase price must be a valid number." },
        { status: 400 },
      );
    }

    const copy = await createLibraryBookCopy({
      tenantId: access.tenantId,
      bookId: payload.bookId.trim(),
      accessionNumber: payload.accessionNumber,
      barcode:
        typeof payload.barcode === "string"
          ? payload.barcode
          : undefined,
      rackId:
        typeof payload.rackId === "string"
          ? payload.rackId
          : undefined,
      purchaseDate:
        typeof payload.purchaseDate === "string"
          ? payload.purchaseDate
          : undefined,
      purchasePrice:
        typeof payload.purchasePrice === "number"
          ? payload.purchasePrice
          : undefined,
      notes:
        typeof payload.notes === "string"
          ? payload.notes
          : undefined,
    });

    return NextResponse.json(copy, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "";

    const conflictErrors = [
      "This accession number already exists in this institution.",
      "This barcode already exists in this institution.",
    ];

    if (conflictErrors.includes(message)) {
      return NextResponse.json(
        { error: message },
        { status: 409 },
      );
    }

    const validationErrors = [
      "Accession number is required.",
      "Purchase price must be a non-negative number.",
      "Purchase date is invalid.",
      "Tenant not found.",
      "Tenant is inactive.",
      "An active book from this institution is required.",
      "An active rack from this institution is required.",
    ];

    if (validationErrors.includes(message)) {
      return NextResponse.json(
        { error: message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Failed to create book copy." },
      { status: 500 },
    );
  }
}
