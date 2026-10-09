import {
  NextResponse,
} from "next/server";

import { Role } from "@prisma/client";

import { requireApiRole } from "@/modules/auth/guards/require-api-role.guard";

import {
  toggleAcademicYear,
} from "@/modules/academic-year/services/toggle.service";

import {
  mapAcademicYear,
} from "@/modules/academic-year/mapper/mapper";

export async function PATCH(
  _request: Request,
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

    const academicYear = await toggleAcademicYear({
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