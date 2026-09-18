import {
  NextRequest,
  NextResponse,
} from "next/server";

import { Role } from "@prisma/client";

import { requireApiRole }
  from "@/modules/auth/guards/require-api-role.guard";

import { getSections }
  from "@/modules/sections/services/get-sections.service";

import { createSection }
  from "@/modules/sections/services/create-section.service";

import {
  createSectionSchema,
} from "@/modules/sections/validators/create-section.validator";

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

    const sections =
      await getSections({
        tenantId:
          currentUser.tenantId,
      });

    return NextResponse.json({
      success: true,
      sections,
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
      createSectionSchema.parse(
        body
      );

    const section =
      await createSection({
        ...validatedData,

        tenantId:
          currentUser.tenantId,
      });

    return NextResponse.json(
      {
        success: true,
        section,
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