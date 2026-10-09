import {
  NextRequest,
  NextResponse,
} from "next/server";

import { Role } from "@prisma/client";

import { requireApiRole } from "@/modules/auth/guards/require-api-role.guard";

import { getUserById } from "@/modules/users/services/get-user-by-id.service";
import { updateUser } from "@/modules/users/services/update-user.service";
import { toggleUserStatus } from "@/modules/users/services/toggle-user-status.service";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  },
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

    const user =
      await getUserById({
        id,
        tenantId:
          currentUser.tenantId,
      });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        {
          status: 404,
        },
      );
    }

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
      },
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
  },
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

    const body =
      await request.json();

    if (
      typeof body.name !==
      "string"
    ) {
      throw new Error(
        "Name is required.",
      );
    }

    if (
      typeof body.phone !==
        "string" ||
      !body.phone.trim()
    ) {
      throw new Error(
        "Phone is required.",
      );
    }

    const { id } =
      await params;

    const user =
      await updateUser({
        id,
        name: body.name,
        phone: body.phone,
        tenantId:
          currentUser.tenantId,
      });

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
      },
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
  },
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

    const user =
      await toggleUserStatus({
        id,
        tenantId:
          currentUser.tenantId,
      });

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
      },
    );
  }
}