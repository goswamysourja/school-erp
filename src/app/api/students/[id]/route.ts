import {
  NextRequest,
  NextResponse,
} from "next/server";

import { Role } from "@prisma/client";

import { requireApiRole }
  from "@/modules/auth/guards/require-api-role.guard";

import { getStudentById }
  from "@/modules/students/services/get-student-by-id.service";

import { updateStudent }
  from "@/modules/students/services/update-student.service";

import {
  updateStudentSchema,
} from "@/modules/students/validators/update-student.validator";

import { toggleStudentStatus }
  from "@/modules/students/services/toggle-student-status.service";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    await requireApiRole([
      Role.SUPER_ADMIN,
    ]);

    const { id } =
      await params;

    const student =
      await getStudentById(
        id
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

export async function PATCH(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    await requireApiRole([
      Role.SUPER_ADMIN,
    ]);

    const body =
      await request.json();

    const validatedData =
      updateStudentSchema.parse(
        body
      );

    const { id } =
      await params;

    const student =
      await updateStudent({
        id,
        ...validatedData,
      });

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

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    await requireApiRole([
      Role.SUPER_ADMIN,
    ]);

    const { id } =
      await params;

    const student =
      await toggleStudentStatus(
        id
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