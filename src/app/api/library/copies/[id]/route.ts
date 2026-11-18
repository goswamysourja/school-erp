
import { LibraryCopyStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { authorizeLibraryApiAccess } from "@/modules/library/guards/authorize-library-api.guard";
import { removeLibraryBookCopy } from "@/modules/library/services/remove-library-book-copy.service";
import { updateLibraryBookCopy } from "@/modules/library/services/update-library-book-copy.service";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(
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
        { error: "A valid book copy ID is required." },
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

    // Accession number and barcode are generated identifiers.
    // They cannot be modified after copy creation.
    const allowedFields = [
      "rackId",
      "purchaseDate",
      "purchasePrice",
      "notes",
      "status",
    ];

    if (
      Object.keys(payload).some(
        (field) => !allowedFields.includes(field),
      )
    ) {
      return NextResponse.json(
        { error: "The request contains unsupported fields." },
        { status: 400 },
      );
    }

    for (const field of [
      "rackId",
      "purchaseDate",
      "notes",
    ] as const) {
      if (
        payload[field] !== undefined &&
        payload[field] !== null &&
        typeof payload[field] !== "string"
      ) {
        return NextResponse.json(
          { error: `${field} must be a string or null.` },
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
        { error: "Purchase price must be a valid number or null." },
        { status: 400 },
      );
    }

    if (
      typeof payload.purchasePrice === "number" &&
      payload.purchasePrice < 0
    ) {
      return NextResponse.json(
        { error: "Purchase price cannot be negative." },
        { status: 400 },
      );
    }

    if (
      payload.status !== undefined &&
      (typeof payload.status !== "string" ||
        !Object.values(LibraryCopyStatus).includes(
          payload.status as LibraryCopyStatus,
        ))
    ) {
      return NextResponse.json(
        { error: "Invalid book copy status." },
        { status: 400 },
      );
    }

    const copy = await updateLibraryBookCopy({
      id,
      tenantId: access.tenantId,

      ...(payload.rackId !== undefined
        ? { rackId: payload.rackId as string | null }
        : {}),

      ...(payload.purchaseDate !== undefined
        ? { purchaseDate: payload.purchaseDate as string | null }
        : {}),

      ...(payload.purchasePrice !== undefined
        ? { purchasePrice: payload.purchasePrice as number | null }
        : {}),

      ...(payload.notes !== undefined
        ? { notes: payload.notes as string | null }
        : {}),

      ...(typeof payload.status === "string"
        ? { status: payload.status as LibraryCopyStatus }
        : {}),
    });

    return NextResponse.json(copy);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";

    if (message === "Book copy not found in this institution.") {
      return NextResponse.json(
        { error: message },
        { status: 404 },
      );
    }

    const conflictErrors = [
      "The rack assignment cannot be changed while the book copy is issued.",
      "Use the circulation operations to issue a book or mark it lost.",
      "Lost or removed copies cannot have their status changed here.",
      "Issued copies and copies with active loans must be updated through circulation operations.",
    ];

    if (conflictErrors.includes(message)) {
      return NextResponse.json(
        { error: message },
        { status: 409 },
      );
    }

    const validationErrors = [
      "Purchase price must be a non-negative number.",
      "Purchase date is invalid.",
      "An active rack from this institution is required.",
      "At least one field must be provided.",
    ];

    if (validationErrors.includes(message)) {
      return NextResponse.json(
        { error: message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Failed to update book copy." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
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
        { error: "A valid book copy ID is required." },
        { status: 400 },
      );
    }

    const copy = await removeLibraryBookCopy({
      id,
      tenantId: access.tenantId,
    });

    return NextResponse.json({
      message: "Book copy retired successfully.",
      copy,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";

    if (message === "Book copy not found in this institution.") {
      return NextResponse.json(
        { error: message },
        { status: 404 },
      );
    }

    if (
      message === "Lost copies must retain their lost status for inventory records." ||
      message === "A book copy with an active loan cannot be removed."
    ) {
      return NextResponse.json(
        { error: message },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Failed to retire book copy." },
      { status: 500 },
    );
  }
}
