import {
  NextRequest,
  NextResponse,
} from "next/server";

import { Role } from "@prisma/client";

import { updateTenant } from "@/modules/tenants/services/update-tenant.service";
import { requireApiRole } from "@/modules/auth/guards/require-api-role.guard";
import { getTenantById } from "@/modules/tenants/services/get-tenant-by-id.service";


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
    await requireApiRole([
      Role.SUPER_ADMIN,
    ]);

    const body =
      await request.json();

    const { id } =
      await params;

    const tenant =
      await updateTenant({
        id,
        ...body,
      });

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

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    await requireApiRole([
      Role.SUPER_ADMIN,
    ]);

    const { id } =
      await params;

    const tenant =
      await getTenantById(
        id
      );

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