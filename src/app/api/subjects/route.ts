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
    const currentUser =
      await requireApiRole([
        Role.ADMIN,
      ]);

    if (!currentUser.tenantId) {
      throw new Error(
        "Tenant assignment missing"
      );
    }

    const subjects =
      await getSubjects({
        tenantId:
          currentUser.tenantId,
      });

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
    const currentUser =
      await requireApiRole([
        Role.ADMIN,
      ]);

    if (!currentUser.tenantId) {
      throw new Error(
        "Tenant assignment missing"
      );
    }

    const body =
      await request.json();

    const validatedData =
      createSubjectSchema.parse(
        body
      );

    const subject =
      await createSubject({
        ...validatedData,

        tenantId:
          currentUser.tenantId,
      });

    return NextResponse.json(
      {
        success: true,
        subject,
      },
      {
        status: 201,
      }
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
      }
    );
  }
}