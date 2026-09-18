import {
  NextRequest,
  NextResponse,
} from "next/server";

import { Role } from "@prisma/client";

import { requireApiRole } from "@/modules/auth/guards/require-api-role.guard";

import { createClass } from "@/modules/classes/services/create-class.service";

import {
  createClassSchema,
} from "@/modules/classes/validators/create-class.validator";

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
      createClassSchema.parse(
        body
      );

    const classroom =
      await createClass({
        ...validatedData,
        tenantId:
          currentUser.tenantId,
      });

    return NextResponse.json({
      success: true,
      classroom,
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