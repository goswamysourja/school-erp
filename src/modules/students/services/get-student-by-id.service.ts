import { prisma } from "@/lib/prisma/client";

export async function getStudentById(
  id: string,
  tenantId: string,
) {
  const student =
    await prisma.student.findUnique({
      where: {
        id,
      },

      include: {
        section: {
          include: {
            class: true,
          },
        },
      },
    });

  if (!student) {
    return null;
  }

  if (
    student.tenantId !==
    tenantId
  ) {
    return null;
  }

  return student;
}