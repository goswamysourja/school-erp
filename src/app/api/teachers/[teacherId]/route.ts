import {
  NextRequest,
  NextResponse,
} from "next/server";

import { Role } from "@prisma/client";

import { requireApiRole } from "@/modules/auth/guards";

import {
  getTeacherById,
  updateTeacher,
} from "@/modules/teacher/services";

import {
  updateTeacherSchema,
} from "@/modules/teacher/validators";

interface RouteContext {
  params: Promise<{
    teacherId: string;
  }>;
}

export async function GET(
  request: NextRequest,
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
      await getTeacherById(
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
            : "Failed to fetch teacher.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(
  request: NextRequest,
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

    const body =
      await request.json();

    const input =
      updateTeacherSchema.parse(
        body,
      );

    const teacher =
      await updateTeacher(
        teacherId,
        currentUser.tenantId,
        input,
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
            : "Failed to update teacher.",
      },
      {
        status: 500,
      },
    );
  }
}