import {
  NextRequest,
  NextResponse,
} from "next/server";

import { Role } from "@prisma/client";

import { requireApiRole }
  from "@/modules/auth/guards/require-api-role.guard";

import {
  getTeachingAssignment,
  updateTeachingAssignment,
  removeTeachingAssignment,
} from "@/modules/teaching-assignment/services";

import {
  updateTeachingAssignmentSchema,
} from "@/modules/teaching-assignment/validators/update";

interface Context {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: Context,
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

    const { id } =
      await params;

    const assignment =
      await getTeachingAssignment(
        id,
        currentUser.tenantId,
      );

    return NextResponse.json({
      success: true,
      assignment,
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

export async function PATCH(
  request: NextRequest,
  { params }: Context,
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

    const { id } =
      await params;

    const body =
      await request.json();

    const validatedData =
      updateTeachingAssignmentSchema.parse(
        body,
      );

    const assignment =
      await updateTeachingAssignment({
        id,

        ...validatedData,

        tenantId:
          currentUser.tenantId,
      });

    return NextResponse.json({
      success: true,
      assignment,
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

export async function DELETE(
  request: NextRequest,
  { params }: Context,
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

    const { id } =
      await params;

    const assignment =
      await removeTeachingAssignment(
        id,
        currentUser.tenantId,
      );

    return NextResponse.json({
      success: true,
      assignment,
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