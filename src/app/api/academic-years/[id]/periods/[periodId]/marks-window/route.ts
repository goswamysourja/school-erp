import {
  NextRequest,
  NextResponse,
} from "next/server";

import { Role } from "@prisma/client";

import { requireApiRole } from "@/modules/auth/guards/require-api-role.guard";

import {
  openMarksUploadWindow,
  lockMarksUploadWindow,
} from "@/modules/academic-year/services/marks.service";

import {
  mapAcademicPeriod,
} from "@/modules/academic-year/mapper/period.mapper";

export async function PATCH(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      id: string;
      periodId: string;
    }>;
  }
) {
  try {
    const currentUser = await requireApiRole([
      Role.ADMIN,
    ]);

    if (!currentUser.tenantId) {
      throw new Error("Tenant assignment missing.");
    }

    const { id, periodId } = await params;

    const body = await request.json();

    if (body.action !== "open" && body.action !== "lock") {
      throw new Error(
        'Action must be either "open" or "lock".'
      );
    }

    const input = {
      id: periodId,
      academicYearId: id,
      tenantId: currentUser.tenantId,
    };

    const period =
      body.action === "open"
        ? await openMarksUploadWindow(input)
        : await lockMarksUploadWindow(input);

    return NextResponse.json({
      success: true,
      period: mapAcademicPeriod(period),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong.",
      },
      {
        status: 400,
      }
    );
  }
}