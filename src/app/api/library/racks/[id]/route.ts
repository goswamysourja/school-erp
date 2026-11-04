
import { NextRequest, NextResponse } from "next/server";

import { authorizeLibraryApiAccess } from "@/modules/library/guards/authorize-library-api.guard";
import { deactivateLibraryRack } from "@/modules/library/services/deactivate-library-rack.service";
import { updateLibraryRack } from "@/modules/library/services/update-library-rack.service";

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
        { error: "A valid rack ID is required." },
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

    const allowedFields = ["rackNumber", "description", "location"];
    const hasUnknownField = Object.keys(payload).some(
      (field) => !allowedFields.includes(field),
    );

    if (hasUnknownField) {
      return NextResponse.json(
        { error: "The request contains unsupported fields." },
        { status: 400 },
      );
    }

    if (
      payload.rackNumber !== undefined &&
      (typeof payload.rackNumber !== "string" ||
        !payload.rackNumber.trim())
    ) {
      return NextResponse.json(
        { error: "Rack number must be a non-empty string." },
        { status: 400 },
      );
    }

    for (const field of ["description", "location"] as const) {
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

    const updateInput: {
      id: string;
      tenantId: string;
      rackNumber?: string;
      description?: string | null;
      location?: string | null;
    } = {
      id,
      tenantId: access.tenantId,
    };

    if (typeof payload.rackNumber === "string") {
      updateInput.rackNumber = payload.rackNumber;
    }

    if (
      payload.description === null ||
      typeof payload.description === "string"
    ) {
      updateInput.description = payload.description;
    }

    if (
      payload.location === null ||
      typeof payload.location === "string"
    ) {
      updateInput.location = payload.location;
    }

    const rack = await updateLibraryRack(updateInput);

    return NextResponse.json(rack);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";

    if (message === "Rack not found in this institution.") {
      return NextResponse.json(
        { error: message },
        { status: 404 },
      );
    }

    if (
      message === "Rack number cannot be empty." ||
      message === "At least one field must be provided."
    ) {
      return NextResponse.json(
        { error: message },
        { status: 400 },
      );
    }

    if (
      message ===
      "A rack with this number already exists in this institution."
    ) {
      return NextResponse.json(
        { error: message },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Failed to update library rack." },
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
        { error: "A valid rack ID is required." },
        { status: 400 },
      );
    }

    const rack = await deactivateLibraryRack({
      id,
      tenantId: access.tenantId,
    });

    return NextResponse.json({
      message: "Library rack deactivated successfully.",
      rack,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";

    if (message === "Rack not found in this institution.") {
      return NextResponse.json(
        { error: message },
        { status: 404 },
      );
    }

    if (
      message ===
      "Move all book copies to another rack before deactivating this rack."
    ) {
      return NextResponse.json(
        { error: message },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Failed to deactivate library rack." },
      { status: 500 },
    );
  }
}
