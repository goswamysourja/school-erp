import {
  NextRequest,
  NextResponse,
} from "next/server";

import { createTenant } from "@/modules/tenants/services/create-tenant.service";

export async function POST(
  request: NextRequest
) {
  try {
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