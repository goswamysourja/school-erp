import {
  NextRequest,
  NextResponse,
} from "next/server";

import { Role } from "@prisma/client";

import { requireApiRole }
  from "@/modules/auth/guards/require-api-role.guard";

import {
  createClassTeacherAssignment,
  listClassTeacherAssignments,
} from "@/modules/class-teacher-assignment/services";

import {
  createClassTeacherAssignmentSchema,
} from "@/modules/class-teacher-assignment/validators/create";

export async function GET() {
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

    const assignments =
      await listClassTeacherAssignments(
        currentUser.tenantId,
      );

    return NextResponse.json({
      success: true,
      assignments,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      },
      {
        status: 400,
      },
    );
  }
}

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

    const validatedData =
      createClassTeacherAssignmentSchema.parse(
        body,
      );

    const assignment =
      await createClassTeacherAssignment({
        ...validatedData,

        tenantId:
          currentUser.tenantId,
      });

    return NextResponse.json(
      {
        success: true,
        assignment,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      },
      {
        status: 400,
      },
    );
  }
}