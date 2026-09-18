import {
  NextRequest,
  NextResponse,
} from "next/server";

import { Role } from "@prisma/client";

import { requireApiRole } from "@/modules/auth/guards/require-api-role.guard";

import { getSubjectById } from "@/modules/subjects/services/get-subject-by-id.service";

import { updateSubject } from "@/modules/subjects/services/update-subject.service";

import { toggleSubjectStatus } from "@/modules/subjects/services/toggle-subject-status.service";

import {
  updateSubjectSchema,
} from "@/modules/subjects/validators/update-subject.validator";

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
    const currentUser =
      await requireApiRole([
        Role.ADMIN,
      ]);

    if (!currentUser.tenantId) {
      throw new Error(
        "Tenant assignment missing"
      );
    }

    const { id } =
      await params;

    const subject =
      await getSubjectById(
        id,
        currentUser.tenantId,
      );

    if (!subject) {
      return NextResponse.json(
        {
          success: false,
          message: "Subject not found",
        },
        {
          status: 404,
        }
      );
    }

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
      updateSubjectSchema.parse(
        body
      );

    const { id } =
      await params;

    const subject =
      await updateSubject({
        id,
        ...validatedData,
        tenantId:
          currentUser.tenantId,
      });

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
    const currentUser =
      await requireApiRole([
        Role.ADMIN,
      ]);

    if (!currentUser.tenantId) {
      throw new Error(
        "Tenant assignment missing"
      );
    }

    const { id } =
      await params;

    const subject =
      await toggleSubjectStatus(
        id,
        currentUser.tenantId,
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
        status: 400
      }
    );
  }
}