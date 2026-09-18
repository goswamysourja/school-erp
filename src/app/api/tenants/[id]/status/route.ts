import {
  NextRequest,
  NextResponse,
} from "next/server";

import { Role } from "@prisma/client";

import { requireApiRole } from "@/modules/auth/guards/require-api-role.guard";
import { updateTenantStatus } from "@/modules/tenants/services/toggle-tenant-status.service";
import {
  updateTenantStatusSchema,
} from "@/modules/tenants/validators/tenant.validator";
import {
  mapTenantToResponse,
} from "@/modules/tenants/mappers/tenant.mapper";

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

    const { id } = await params;

    const body = await request.json();

    const validatedData =
      updateTenantStatusSchema.parse(body);

    const tenant = await updateTenantStatus({
      tenantId: id,
      status: validatedData.status,
    });

    return NextResponse.json({
      success: true,
      tenant: mapTenantToResponse(tenant),
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
