import { NextResponse } from "next/server";

import { Role } from "@prisma/client";

import { requireApiRole } from "@/modules/auth/guards";

import {
  toggleTeacherStatus,
} from "@/modules/teacher/services";

interface RouteContext {
  params: Promise<{
    teacherId: string;
  }>;
}

export async function PATCH(
  request: Request,
  { params }: RouteContext,
) {
  try {
    const currentUser =
      await requireApiRole([
        Role.ADMIN,
      ]);

    if (!currentUser.tenantId) {
      throw new Error(
        "Tenant assignment missing.",
      );
    }

    const { teacherId } =
      await params;

    const teacher =
      await toggleTeacherStatus(
        teacherId,
        currentUser.tenantId,
      );

    return NextResponse.json(
      teacher,
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to update teacher status.",
      },
      {
        status: 500,
      },
    );
  }
}