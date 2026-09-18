import {
  NextRequest,
  NextResponse,
} from "next/server";

import { Role } from "@prisma/client";

import { requireApiRole }
  from "@/modules/auth/guards/require-api-role.guard";

import { createStudent }
  from "@/modules/students/services/create-student.service";

import { getStudents }
  from "@/modules/students/services/get-students.service";

import {
  createStudentSchema,
} from "@/modules/students/validators/create-student.validator";

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

    const students =
      await getStudents(
        currentUser.tenantId,
      );

    return NextResponse.json({
      success: true,
      students,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong",
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
      createStudentSchema.parse(
        body,
      );

    const student =
      await createStudent({
        ...validatedData,

        tenantId:
          currentUser.tenantId,
      });

    return NextResponse.json(
      {
        success: true,
        student,
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
            : "Something went wrong",
      },
      {
        status: 400,
      },
    );
  }
}