import {
  NextRequest,
  NextResponse,
} from "next/server";

import { Role } from "@prisma/client";

import { requireApiRole }
  from "@/modules/auth/guards/require-api-role.guard";

import { getSectionById }
  from "@/modules/sections/services/get-section-by-id.service";

import { updateSection }
  from "@/modules/sections/services/update-section.service";

import { toggleSectionStatus }
  from "@/modules/sections/services/toggle-section-status.service";

import {
  updateSectionSchema,
} from "@/modules/sections/validators/update-section.validator";

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

    const section =
      await getSectionById(
        id,
        currentUser.tenantId,
      );

    if (!section) {
      return NextResponse.json(
        {
          success: false,
          message: "Section not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      section,
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
      updateSectionSchema.parse(
        body
      );

    const { id } =
      await params;

    const section =
      await updateSection({
        id,

        ...validatedData,

        tenantId:
          currentUser.tenantId,
      });

    return NextResponse.json({
      success: true,
      section,
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

    const section =
      await toggleSectionStatus({
        id,

        tenantId:
          currentUser.tenantId,
      });

    return NextResponse.json({
      success: true,
      section,
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