import {
  NextRequest,
  NextResponse,
} from "next/server";

import { Role } from "@prisma/client";

import { requireApiRole } from "@/modules/auth/guards";

import {
  createTeacher,
} from "@/modules/teacher/services";

import {
  createTeacherSchema,
} from "@/modules/teacher/validators";

export async function POST(
  request: NextRequest,
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

    const body =
      await request.json();

    const input =
      createTeacherSchema.parse(
        body,
      );

    const teacher =
      await createTeacher({
        ...input,
        tenantId:
          currentUser.tenantId,
      });

    return NextResponse.json(
      teacher,
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "CREATE TEACHER API ERROR:",
      error,
    );

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to create teacher.",
      },
      {
        status: 500,
      },
    );
  }
}