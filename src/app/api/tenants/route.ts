import {
  NextRequest,
  NextResponse,
} from "next/server";

import { Role } from "@prisma/client";

import { requireApiRole } from "@/modules/auth/guards/require-api-role.guard";

import {
  createTenantSchema,
} from "@/modules/tenants/validators/tenant.validator";

import {
  createTenant,
} from "@/modules/tenants/services/create-tenant.service";

import {
  getTenants,
} from "@/modules/tenants/services/get-tenants.service";

import {
  mapTenantToResponse,
} from "@/modules/tenants/mappers/tenant.mapper";

export async function POST(
  request: NextRequest,
) {
  try {
    await requireApiRole([
      Role.SUPER_ADMIN,
    ]);

    const body =
      await request.json();

    const validatedData =
      createTenantSchema.parse(body);

    const result =
      await createTenant(
        validatedData,
      );

    return NextResponse.json({
      success: true,
      tenant: mapTenantToResponse(
        result.tenant,
      ),
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
    await requireApiRole([
      Role.SUPER_ADMIN,
    ]);

    const tenants =
      await getTenants();

    return NextResponse.json({
      success: true,
      tenants: tenants.map(
        mapTenantToResponse,
      ),
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