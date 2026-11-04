
import { NextRequest, NextResponse } from "next/server";

import { authorizeLibraryApiAccess } from "@/modules/library/guards/authorize-library-api.guard";
import { createLibraryCategory } from "@/modules/library/services/create-library-category.service";
import { getLibraryCategories } from "@/modules/library/services/get-library-categories.service";

export async function GET(request: NextRequest) {
  try {
    const access = await authorizeLibraryApiAccess();

    if (!access.authorized) {
      return NextResponse.json(
        { error: access.error },
        { status: access.status },
      );
    }

    const activeOnly =
      request.nextUrl.searchParams.get("activeOnly") === "true";

    const categories = await getLibraryCategories({
      tenantId: access.tenantId,
      activeOnly,
    });

    return NextResponse.json(categories);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch library categories." },
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
      typeof payload.name !== "string" ||
      !payload.name.trim()
    ) {
      return NextResponse.json(
        { error: "A valid category name is required." },
        { status: 400 },
      );
    }

    if (
      payload.description !== undefined &&
      payload.description !== null &&
      typeof payload.description !== "string"
    ) {
      return NextResponse.json(
        { error: "Category description must be a string." },
        { status: 400 },
      );
    }

    const category = await createLibraryCategory({
      tenantId: access.tenantId,
      name: payload.name,
      description:
        typeof payload.description === "string"
          ? payload.description
          : undefined,
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "";

    if (
      message ===
      "A category with this name already exists in this institution."
    ) {
      return NextResponse.json(
        { error: message },
        { status: 409 },
      );
    }

    if (
      message === "Category name is required." ||
      message === "Tenant not found." ||
      message === "Tenant is inactive."
    ) {
      return NextResponse.json(
        { error: message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Failed to create library category." },
      { status: 500 },
    );
  }
}
