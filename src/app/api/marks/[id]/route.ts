import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";

import { requireApiRole } from "@/modules/auth/guards/require-api-role.guard";
import { getMark } from "@/modules/marks/services/get.service";
import { updateMark } from "@/modules/marks/services/update.service";
import { updateMarkSchema } from "@/modules/marks/validators/validator";
import { mapMark } from "@/modules/marks/mapper/mapper";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

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

export async function GET(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const currentUser = await requireApiRole([
      Role.ADMIN,
      Role.TEACHER,
    ]);

    if (!currentUser.tenantId) {
      throw new Error("Tenant context is required.");
    }

    const { id } = await context.params;

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

    const mark = await getMark({
      id,
      tenantId: currentUser.tenantId,
      teacherId,
      classTeacherSectionIds,
    });

    if (!mark) {
      return NextResponse.json(
        {
          success: false,
          message: "Marks not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      mark: mapMark(mark),
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

export async function PATCH(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const currentUser = await requireApiRole([
      Role.ADMIN,
      Role.TEACHER,
    ]);

    if (!currentUser.tenantId) {
      throw new Error("Tenant context is required.");
    }

    const { id } = await context.params;

    /*
     * PATCH is WRITE access.
     *
     * Therefore we intentionally do NOT pass
     * classTeacherSectionIds here.
     *
     * A Class Teacher who only has read access to a mark
     * must not be able to update it.
     */
    const teacherId =
      currentUser.role === Role.TEACHER
        ? currentUser.teacher?.id
        : undefined;

    if (currentUser.role === Role.TEACHER && !teacherId) {
      throw new Error("Teacher profile not found.");
    }

    const existingMark = await getMark({
      id,
      tenantId: currentUser.tenantId,
      teacherId,
    });

    if (!existingMark) {
      return NextResponse.json(
        {
          success: false,
          message: "Marks not found.",
        },
        { status: 404 },
      );
    }

    const body = await request.json();

    const parsed = updateMarkSchema.safeParse(body);

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
      !isTeacherAssignmentAllowed(
        currentUser,
        parsed.data.teachingAssignmentId,
      )
    ) {
      throw new Error("Unauthorized.");
    }

    const mark = await updateMark({
      id,
      tenantId: currentUser.tenantId,
      ...parsed.data,
    });

    return NextResponse.json({
      success: true,
      mark: mapMark(mark),
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to update marks.";

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