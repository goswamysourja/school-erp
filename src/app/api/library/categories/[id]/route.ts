
import { NextRequest, NextResponse } from "next/server";

import { authorizeLibraryApiAccess } from "@/modules/library/guards/authorize-library-api.guard";
import { deactivateLibraryCategory } from "@/modules/library/services/deactivate-library-category.service";
import { updateLibraryCategory } from "@/modules/library/services/update-library-category.service";

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
        { error: "A valid category ID is required." },
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

    const category = await updateLibraryCategory({
      id,
      tenantId: access.tenantId,
      name: payload.name,
      description:
        typeof payload.description === "string"
          ? payload.description
          : undefined,
    });

    return NextResponse.json(category);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "";

    if (message === "Category not found in this institution.") {
      return NextResponse.json(
        { error: message },
        { status: 404 },
      );
    }

    if (
      message ===
      "A category with this name already exists in this institution."
    ) {
      return NextResponse.json(
        { error: message },
        { status: 409 },
      );
    }

    if (message === "Category name is required.") {
      return NextResponse.json(
        { error: message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Failed to update library category." },
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
        { error: "A valid category ID is required." },
        { status: 400 },
      );
    }

    const category = await deactivateLibraryCategory({
      id,
      tenantId: access.tenantId,
    });

    return NextResponse.json({
      message: "Library category deactivated successfully.",
      category,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "";

    if (message === "Category not found in this institution.") {
      return NextResponse.json(
        { error: message },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { error: "Failed to deactivate library category." },
      { status: 500 },
    );
  }
}
