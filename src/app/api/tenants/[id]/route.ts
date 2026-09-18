import {
  NextRequest,
  NextResponse,
} from "next/server";

import { Role } from "@prisma/client";

import { requireApiRole } from "@/modules/auth/guards/require-api-role.guard";

import { getTenantById }
  from "@/modules/tenants/services/get-tenant-by-id.service";

import { updateTenant }
  from "@/modules/tenants/services/update-tenant.service";

import { updateTenantStatus }
  from "@/modules/tenants/services/toggle-tenant-status.service";

import {
  updateTenantSchema,
  updateTenantStatusSchema,
} from "@/modules/tenants/validators/tenant.validator";

import {
  mapTenantToResponse,
} from "@/modules/tenants/mappers/tenant.mapper";

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

    const { id } = await params;

    const tenant = await getTenantById(id);

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

    /*
     * Status update
     */
    if ("status" in body) {
      const validatedData =
        updateTenantStatusSchema.parse(body);

      const tenant =
        await updateTenantStatus({
          tenantId: id,
          status: validatedData.status,
        });

      return NextResponse.json({
        success: true,
        tenant: mapTenantToResponse(tenant),
      });
    }

    /*
     * Tenant metadata update
     */
    const validatedData =
      updateTenantSchema.parse(body);

    const tenant =
      await updateTenant({
        tenantId: id,
        ...validatedData,
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