import {
  NextRequest,
  NextResponse,
} from "next/server";

import { Role } from "@prisma/client";

import { createTenant } from "@/modules/tenants/services/create-tenant.service";
import { requireApiRole } from "@/modules/auth/guards/require-api-role.guard";
import { getTenants } from "@/modules/tenants/services/get-tenants.service";


export async function POST(
  request: NextRequest
) {
  try {
    await requireApiRole([
      Role.SUPER_ADMIN,
    ]);

    const body =
      await request.json();

    const tenant =
      await createTenant(body);

    return NextResponse.json({
      success: true,
      tenant,
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

    const tenants =
      await getTenants();

    return NextResponse.json({
      success: true,
      tenants,
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