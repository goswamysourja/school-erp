import {
  NextRequest,
  NextResponse,
} from "next/server";

import { Role } from "@prisma/client";

import { requireApiRole } from "@/modules/auth/guards/require-api-role.guard";

import { createUser } from "@/modules/users/services/create-user.service";
import { getUsers } from "@/modules/users/services/get-users.service";


export async function POST(
  request: NextRequest
) {
  try {
    await requireApiRole([
      Role.SUPER_ADMIN,
    ]);

    const body =
      await request.json();

    const user =
      await createUser(body);

    return NextResponse.json({
      success: true,
      user,
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

export async function GET() {
  try {
    await requireApiRole([
      Role.SUPER_ADMIN,
    ]);

    const users =
      await getUsers();

    return NextResponse.json({
      success: true,
      users,
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