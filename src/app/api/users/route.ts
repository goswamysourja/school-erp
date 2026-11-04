import {
  NextRequest,
  NextResponse,
} from "next/server";

import { Role } from "@prisma/client";

import { requireApiRole } from "@/modules/auth/guards/require-api-role.guard";

import { createUser } from "@/modules/users/services/create-user.service";

import { getTenantUsers } from "@/modules/users/services/get-tenant-users.service";

import { createUserSchema } from "@/modules/users/validators/create-user.validator";

export async function POST(
  request: NextRequest,
) {
  try {
    const currentUser = await requireApiRole([
      Role.ADMIN,
    ]);

    if (!currentUser.tenantId) {
      throw new Error("Tenant assignment missing.");
    }

    const body = await request.json();

    const validatedData = createUserSchema.parse(body);

    const user = await createUser({
      name: validatedData.name,
      phone: validatedData.phone,
      designation: validatedData.designation,
      tenantId: currentUser.tenantId,
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

export async function GET() {
  try {
    const currentUser = await requireApiRole([
      Role.ADMIN,
    ]);

    if (!currentUser.tenantId) {
      throw new Error("Tenant assignment missing.");
    }

    const users = await getTenantUsers({
      tenantId: currentUser.tenantId,
    });

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
      },
    );
  }
}