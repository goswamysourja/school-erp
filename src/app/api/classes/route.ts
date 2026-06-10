import {
  NextRequest,
  NextResponse,
} from "next/server";

import { Role } from "@prisma/client";

import { requireApiRole } from "@/modules/auth/guards/require-api-role.guard";

import { createClass } from "@/modules/classes/services/create-class.service";

export async function POST(
  request: NextRequest
) {
  try {
    await requireApiRole([
      Role.SUPER_ADMIN,
    ]);

    const body =
      await request.json();

    const classroom =
      await createClass(body);

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