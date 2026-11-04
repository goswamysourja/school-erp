
import { NextRequest, NextResponse } from "next/server";

import { authorizeLibraryApiAccess } from "@/modules/library/guards/authorize-library-api.guard";
import { createLibraryBook } from "@/modules/library/services/create-library-book.service";
import { getLibraryBooks } from "@/modules/library/services/get-library-books.service";

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

    const books = await getLibraryBooks({
      tenantId: access.tenantId,
      search: searchParams.get("search") || undefined,
      categoryId: searchParams.get("categoryId") || undefined,
      rackNumber: searchParams.get("rackNumber") || undefined,
      activeOnly: searchParams.get("activeOnly") === "true",
      availableOnly: searchParams.get("availableOnly") === "true",
    });

    return NextResponse.json(books);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch library books." },
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
      typeof payload.title !== "string" ||
      !payload.title.trim()
    ) {
      return NextResponse.json(
        { error: "A valid book title is required." },
        { status: 400 },
      );
    }

    if (
      typeof payload.categoryId !== "string" ||
      !payload.categoryId.trim()
    ) {
      return NextResponse.json(
        { error: "A valid category ID is required." },
        { status: 400 },
      );
    }

    const optionalStringFields = [
      "author",
      "publisher",
      "isbn",
      "edition",
      "language",
      "description",
    ] as const;

    for (const field of optionalStringFields) {
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
      payload.publicationYear !== undefined &&
      payload.publicationYear !== null &&
      (typeof payload.publicationYear !== "number" ||
        !Number.isInteger(payload.publicationYear))
    ) {
      return NextResponse.json(
        { error: "Publication year must be an integer." },
        { status: 400 },
      );
    }

    const book = await createLibraryBook({
      tenantId: access.tenantId,
      categoryId: payload.categoryId.trim(),
      title: payload.title,
      author: typeof payload.author === "string" ? payload.author : undefined,
      publisher:
        typeof payload.publisher === "string"
          ? payload.publisher
          : undefined,
      isbn: typeof payload.isbn === "string" ? payload.isbn : undefined,
      edition:
        typeof payload.edition === "string"
          ? payload.edition
          : undefined,
      language:
        typeof payload.language === "string"
          ? payload.language
          : undefined,
      description:
        typeof payload.description === "string"
          ? payload.description
          : undefined,
      publicationYear:
        typeof payload.publicationYear === "number"
          ? payload.publicationYear
          : undefined,
    });

    return NextResponse.json(book, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";

    if (
      message ===
      "A book with this ISBN already exists in this institution."
    ) {
      return NextResponse.json(
        { error: message },
        { status: 409 },
      );
    }

    if (
      message === "Book title is required." ||
      message === "Publication year is invalid." ||
      message === "Tenant not found." ||
      message === "Tenant is inactive." ||
      message ===
        "An active category from this institution is required."
    ) {
      return NextResponse.json(
        { error: message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Failed to create library book." },
      { status: 500 },
    );
  }
}
