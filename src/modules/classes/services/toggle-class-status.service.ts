import { prisma } from "@/lib/prisma/client";

export async function toggleClassStatus(
  id: string
) {
  const classItem =
    await prisma.class.findUnique({
      where: {
        id,
      },
    });

  if (!classItem) {
    throw new Error(
      "Class not found"
    );
  }

  return prisma.class.update({
    where: {
      id,
    },
    data: {
      isActive:
        !classItem.isActive,
    },
  });
}