import { Teacher } from "@prisma/client";

import { prisma } from "@/lib/prisma/client";

export async function requireTeacherExists(
  teacherId: string,
): Promise<Teacher> {
  const teacher = await prisma.teacher.findUnique({
    where: {
      id: teacherId,
    },
  });

  if (!teacher) {
    throw new Error("Teacher not found.");
  }

  return teacher;
}