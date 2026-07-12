import {
  NextRequest,
  NextResponse,
} from "next/server";

import { Role } from "@prisma/client";

import { requireApiRole }
  from "@/modules/auth/guards/require-api-role.guard";

import { getSubjects }
  from "@/modules/subjects/services/get-subjects.service";

import { createSubject }
  from "@/modules/subjects/services/create-subject.service";

import {
  createSubjectSchema,
} from "@/modules/subjects/validators/create-subject.validator";

export async function GET() {
  try {
    await requireApiRole([
      Role.SUPER_ADMIN,
      Role.ADMIN,
    ]);

    const subjects =
      await getSubjects();

    return NextResponse.json({
      success: true,
      subjects,
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
      Role.ADMIN,
    ]);

    const body =
      await request.json();

    const validatedData =
      createSubjectSchema.parse(
        body
      );

    const subject =
      await createSubject(
        validatedData
      );

    return NextResponse.json({
      success: true,
      subject,
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