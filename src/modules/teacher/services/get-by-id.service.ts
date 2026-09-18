import { prisma } from "@/lib/prisma/client";

import { requireTeacherExists } from "../guards";

import { mapTeacherResponse } from "../mapper";

export async function getTeacherById(
  teacherId: string,
  tenantId: string,
) {
  const teacher = await requireTeacherExists(teacherId);

  if (teacher.tenantId !== tenantId) {
    throw new Error("Teacher does not belong to this tenant.");
  }

  const teacherWithRelations =
    await prisma.teacher.findUnique({
      where: {
        id: teacher.id,
      },
      include: {
        tenant: true,
        user: true,
      },
    });

  if (!teacherWithRelations) {
    throw new Error("Teacher not found.");
  }

  return mapTeacherResponse(teacherWithRelations);
}