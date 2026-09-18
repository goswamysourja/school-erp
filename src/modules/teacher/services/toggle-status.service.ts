import { prisma } from "@/lib/prisma/client";

import { requireTeacherExists } from "../guards";

import { mapTeacherResponse } from "../mapper";

export async function toggleTeacherStatus(
  teacherId: string,
  tenantId: string,
) {
  const teacher =
    await requireTeacherExists(
      teacherId,
    );

  if (teacher.tenantId !== tenantId) {
    throw new Error(
      "Teacher does not belong to this tenant.",
    );
  }

  const updatedTeacher =
    await prisma.teacher.update({
      where: {
        id: teacher.id,
      },

      data: {
        isActive:
          !teacher.isActive,
      },

      include: {
        tenant: true,
        user: true,
      },
    });

  return mapTeacherResponse(
    updatedTeacher,
  );
}