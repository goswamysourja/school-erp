
import { NextRequest, NextResponse } from "next/server";

import { authorizeLibraryApiAccess } from "@/modules/library/guards/authorize-library-api.guard";
import { createLibraryRack } from "@/modules/library/services/create-library-rack.service";
import { getLibraryRacks } from "@/modules/library/services/get-library-racks.service";

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

    const racks = await getLibraryRacks({
      tenantId: access.tenantId,
      activeOnly,
    });

    return NextResponse.json(racks);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch library racks." },
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
      typeof payload.rackNumber !== "string" ||
      !payload.rackNumber.trim()
    ) {
      return NextResponse.json(
        { error: "A valid rack number is required." },
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
          { error: `${field} must be a string.` },
          { status: 400 },
        );
      }
    }

    const rack = await createLibraryRack({
      tenantId: access.tenantId,
      rackNumber: payload.rackNumber,
      description:
        typeof payload.description === "string"
          ? payload.description
          : undefined,
      location:
        typeof payload.location === "string"
          ? payload.location
          : undefined,
    });

    return NextResponse.json(rack, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";

    if (
      message ===
      "A rack with this number already exists in this institution."
    ) {
      return NextResponse.json(
        { error: message },
        { status: 409 },
      );
    }

    if (
      message === "Rack number is required." ||
      message === "Tenant not found." ||
      message === "Tenant is inactive."
    ) {
      return NextResponse.json(
        { error: message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Failed to create library rack." },
      { status: 500 },
    );
  }
}
