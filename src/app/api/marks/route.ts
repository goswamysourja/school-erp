import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";

import { requireApiRole } from "@/modules/auth/guards/require-api-role.guard";
import { createMark } from "@/modules/marks/services/create.service";
import { listMarks } from "@/modules/marks/services/list.service";
import { createMarkSchema } from "@/modules/marks/validators/validator";
import { mapMark, mapMarks } from "@/modules/marks/mapper/mapper";

function isTeacherAssignmentAllowed(
  user: Awaited<ReturnType<typeof requireApiRole>>,
  teachingAssignmentId: string,
) {
  if (user.role === Role.ADMIN) {
    return true;
  }

  if (user.role !== Role.TEACHER || !user.teacher) {
    return false;
  }

  return user.teacher.teachingAssignments.some(
    (assignment) => assignment.id === teachingAssignmentId,
  );
}

export async function GET(request: NextRequest) {
  try {
    const currentUser = await requireApiRole([
      Role.ADMIN,
      Role.TEACHER,
    ]);

    if (!currentUser.tenantId) {
      throw new Error("Tenant context is required.");
    }

    const { searchParams } = new URL(request.url);

    const studentId = searchParams.get("studentId") || undefined;
    const teachingAssignmentId =
      searchParams.get("teachingAssignmentId") || undefined;
    const academicPeriodId =
      searchParams.get("academicPeriodId") || undefined;

    const teacherId =
      currentUser.role === Role.TEACHER
        ? currentUser.teacher?.id
        : undefined;

    if (currentUser.role === Role.TEACHER && !teacherId) {
      throw new Error("Teacher profile not found.");
    }

    const classTeacherSectionIds =
      currentUser.role === Role.TEACHER && currentUser.teacher
        ? currentUser.teacher.classTeacherAssignments.map(
            (assignment) => assignment.sectionId,
          )
        : [];

    const marks = await listMarks({
      tenantId: currentUser.tenantId,
      teacherId,
      classTeacherSectionIds,
      studentId,
      teachingAssignmentId,
      academicPeriodId,
    });

    return NextResponse.json({
      success: true,
      marks: mapMarks(marks),
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch marks.";

    const status =
      message === "Unauthenticated"
        ? 401
        : message === "Unauthorized."
          ? 403
          : 400;

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await requireApiRole([
      Role.ADMIN,
      Role.TEACHER,
    ]);

    if (!currentUser.tenantId) {
      throw new Error("Tenant context is required.");
    }

    const body = await request.json();

    const parsed = createMarkSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid mark data.",
          errors: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    if (
      currentUser.role === Role.TEACHER &&
      !currentUser.teacher
    ) {
      throw new Error("Teacher profile not found.");
    }

    if (
      !isTeacherAssignmentAllowed(
        currentUser,
        parsed.data.teachingAssignmentId,
      )
    ) {
      throw new Error("Unauthorized.");
    }

    const mark = await createMark({
      ...parsed.data,
      tenantId: currentUser.tenantId,
    });

    return NextResponse.json(
      {
        success: true,
        mark: mapMark(mark),
      },
      { status: 201 },
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to create marks.";

    const status =
      message === "Unauthenticated"
        ? 401
        : message === "Unauthorized."
          ? 403
          : 400;

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status },
    );
  }
}