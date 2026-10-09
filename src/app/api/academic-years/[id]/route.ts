import {
  NextRequest,
  NextResponse,
} from "next/server";

import { Role } from "@prisma/client";

import { requireApiRole } from "@/modules/auth/guards/require-api-role.guard";

import {
  getAcademicYear,
} from "@/modules/academic-year/services/get.service";

import {
  updateAcademicYear,
} from "@/modules/academic-year/services/update.service";

import {
  deleteAcademicYear,
} from "@/modules/academic-year/services/delete.service";

import {
  mapAcademicYear,
} from "@/modules/academic-year/mapper/mapper";

import {
  createAcademicYearSchema,
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

    const academicYear = await getAcademicYear({
      id,
      tenantId: currentUser.tenantId,
    });

    if (!academicYear) {
      return NextResponse.json(
        {
          success: false,
          message: "Academic year not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      academicYear,
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

    const input = createAcademicYearSchema.parse(body);

    const academicYear = await updateAcademicYear({
      id,
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

export async function DELETE(
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

    const academicYear = await deleteAcademicYear({
      id,
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