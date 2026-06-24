import { prisma } from "@/lib/prisma/client";

export async function toggleStudentStatus(
  id: string
) {
  const student =
    await prisma.student.findUnique({
      where: {
        id,
      },
    });

  if (!student) {
    throw new Error(
      "Student not found"
    );
  }

  return prisma.student.update({
    where: {
      id,
    },
    data: {
      isActive:
        !student.isActive,
    },
  });
}