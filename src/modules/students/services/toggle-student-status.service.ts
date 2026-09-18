import { prisma } from "@/lib/prisma/client";

export async function toggleStudentStatus(
  id: string,
  tenantId: string,
) {
  const student =
    await prisma.student.findUnique({
      where: {
        id,
      },
    });

  if (!student) {
    throw new Error(
      "Student not found.",
    );
  }

  if (
    student.tenantId !==
    tenantId
  ) {
    throw new Error(
      "Student does not belong to this tenant.",
    );
  }

  const updatedStudent =
    await prisma.student.update({
      where: {
        id: student.id,
      },

      data: {
        isActive:
          !student.isActive,
      },
    });

  return updatedStudent;
}