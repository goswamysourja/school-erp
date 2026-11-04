import { NextResponse } from "next/server";
import { Role } from "@prisma/client";

import { getAuthUser } from "@/modules/auth/services/get-auth-user.service";
import { removeLibraryStaff } from "@/modules/library/services/remove-library-staff.service";

interface RouteContext {
  params: Promise<{
    userId: string;
  }>;
}

export async function DELETE(
  _request: Request,
  context: RouteContext,
) {
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

    const { userId } = await context.params;

    if (!userId.trim()) {
      return NextResponse.json(
        { error: "A valid userId is required." },
        { status: 400 },
      );
    }

    const assignment = await removeLibraryStaff({
      tenantId: currentUser.tenantId,
      userId: userId.trim(),
    });

    return NextResponse.json({
      message: "Library staff assignment deactivated successfully.",
      assignment,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "";

    if (
      message ===
      "Library staff assignment not found in this institution."
    ) {
      return NextResponse.json(
        { error: message },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { error: "Failed to deactivate library staff assignment." },
      { status: 500 },
    );
  }
}