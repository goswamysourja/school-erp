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
    await requireApiRole([
      Role.SUPER_ADMIN,
    ]);

    const students =
      await getStudents();

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
      }
    );
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    await requireApiRole([
      Role.SUPER_ADMIN,
    ]);

    const body =
      await request.json();

    const validatedData =
      createStudentSchema.parse(
        body
      );

    const student =
      await createStudent(
        validatedData
      );

    return NextResponse.json({
      success: true,
      student,
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
      }
    );
  }
}