import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";

import { getAuthUser } from "@/modules/auth/services/get-auth-user.service";
import { assignLibraryStaff } from "@/modules/library/services/assign-library-staff.service";
import { getLibraryStaff } from "@/modules/library/services/get-library-staff.service";

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getAuthUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 },
      );
    }

    if (currentUser.role !== Role.ADMIN) {
      return NextResponse.json(
        { error: "Only administrators can manage library staff." },
        { status: 403 },
      );
    }

    if (!currentUser.tenantId) {
      return NextResponse.json(
        { error: "Tenant assignment missing." },
        { status: 400 },
      );
    }

    const activeOnly =
      request.nextUrl.searchParams.get("activeOnly") === "true";

    const staff = await getLibraryStaff({
      tenantId: currentUser.tenantId,
      activeOnly,
    });

    return NextResponse.json(staff);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch library staff." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const currentUser = await getAuthUser();

  if (!currentUser) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  }

  if (currentUser.role !== Role.ADMIN) {
    return NextResponse.json(
      { error: "Only administrators can assign library staff." },
      { status: 403 },
    );
  }

  if (!currentUser.tenantId) {
    return NextResponse.json(
      { error: "Tenant assignment missing." },
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
    !("userId" in body) ||
    typeof body.userId !== "string" ||
    !body.userId.trim()
  ) {
    return NextResponse.json(
      { error: "A valid userId is required." },
      { status: 400 },
    );
  }

  try {
    const assignment = await assignLibraryStaff({
      tenantId: currentUser.tenantId,
      userId: body.userId.trim(),
    });

    return NextResponse.json(assignment, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "";

    const knownErrors = [
      "Tenant not found.",
      "Tenant is inactive.",
      "Staff member does not belong to this institution.",
      "Staff member is inactive.",
      "Only staff members can be assigned to library responsibilities.",
    ];

    if (knownErrors.includes(message)) {
      return NextResponse.json(
        { error: message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Failed to assign library staff." },
      { status: 500 },
    );
  }
}