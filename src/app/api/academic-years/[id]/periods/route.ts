import {
  NextRequest,
  NextResponse,
} from "next/server";

import { Role } from "@prisma/client";

import { requireApiRole } from "@/modules/auth/guards/require-api-role.guard";

import {
  createAcademicPeriod,
} from "@/modules/academic-year/services/period.service";

import {
  getAcademicPeriods,
} from "@/modules/academic-year/services/period.get.service";

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

    const { id } = await params;

    const periods = await getAcademicPeriods({
      academicYearId: id,
      tenantId: currentUser.tenantId,
    });

    return NextResponse.json({
      success: true,
      periods,
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

export async function POST(
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
    const currentUser = await requireApiRole([
      Role.ADMIN,
    ]);

    if (!currentUser.tenantId) {
      throw new Error("Tenant assignment missing.");
    }

    const { id } = await params;

    const body = await request.json();

    const input = createAcademicPeriodSchema.parse(body);

    if (input.academicYearId !== id) {
      throw new Error(
        "Academic period does not belong to the selected academic year."
      );
    }

    const period = await createAcademicPeriod({
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