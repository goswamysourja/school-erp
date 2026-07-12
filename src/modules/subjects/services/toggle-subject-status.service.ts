import { prisma } from "@/lib/prisma/client";

export async function toggleSubjectStatus(
  id: string
) {
  const subject =
    await prisma.subject.findUnique({
      where: {
        id,
      },
    });

  if (!subject) {
    throw new Error(
      "Subject not found"
    );
  }

  return prisma.subject.update({
    where: {
      id,
    },
    data: {
      isActive:
        !subject.isActive,
    },
  });
}