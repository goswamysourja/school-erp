import {
  NextRequest,
  NextResponse,
} from "next/server";

import { Role } from "@prisma/client";

import { requireApiRole } from "@/modules/auth/guards/require-api-role.guard";

import {
  getAcademicPeriod,
} from "@/modules/academic-year/services/period.get.service";

import {
  updateAcademicPeriod,
} from "@/modules/academic-year/services/period.update.service";

import {
  deleteAcademicPeriod,
} from "@/modules/academic-year/services/period.delete.service";

import {
  mapAcademicPeriod,
} from "@/modules/academic-year/mapper/period.mapper";

import {
  createAcademicPeriodSchema,
} from "@/modules/academic-year/validators/validator";

export async function GET(
  _request: NextRequest,
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

    const period = await getAcademicPeriod({
      id: periodId,
      academicYearId: id,
      tenantId: currentUser.tenantId,
    });

    if (!period) {
      return NextResponse.json(
        {
          success: false,
          message: "Academic period not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      period,
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

    const input = createAcademicPeriodSchema.parse(body);

    if (input.academicYearId !== id) {
      throw new Error(
        "Academic period does not belong to the selected academic year."
      );
    }

    const period = await updateAcademicPeriod({
      id: periodId,
      name: input.name,
      type: input.type,
      startDate: input.startDate,
      endDate: input.endDate,
      academicYearId: id,
      tenantId: currentUser.tenantId,
    });

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

export async function DELETE(
  _request: NextRequest,
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

    const period = await deleteAcademicPeriod({
      id: periodId,
      academicYearId: id,
      tenantId: currentUser.tenantId,
    });

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