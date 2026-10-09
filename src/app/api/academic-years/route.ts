import {
  NextRequest,
  NextResponse,
} from "next/server";

import { Role } from "@prisma/client";

import { requireApiRole } from "@/modules/auth/guards/require-api-role.guard";

import { createAcademicYear } from "@/modules/academic-year/services/create.service";
import { getAcademicYears } from "@/modules/academic-year/services/get.service";

import { mapAcademicYear } from "@/modules/academic-year/mapper/mapper";

import {
  createAcademicYearSchema,
} from "@/modules/academic-year/validators/validator";

export async function POST(request: NextRequest) {
  try {
    const currentUser = await requireApiRole([
      Role.ADMIN,
    ]);

    if (!currentUser.tenantId) {
      throw new Error("Tenant assignment missing.");
    }

    const body = await request.json();

    const input = createAcademicYearSchema.parse(body);

    const academicYear = await createAcademicYear({
      name: input.name,
      startDate: input.startDate,
      endDate: input.endDate,
      tenantId: currentUser.tenantId,
    });

    return NextResponse.json({
      success: true,
      academicYear: mapAcademicYear(academicYear),
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

export async function GET() {
  try {
    const currentUser = await requireApiRole([
      Role.ADMIN,
    ]);

    if (!currentUser.tenantId) {
      throw new Error("Tenant assignment missing.");
    }

    const academicYears = await getAcademicYears({
      tenantId: currentUser.tenantId,
    });

    return NextResponse.json({
      success: true,
      academicYears,
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