import { prisma } from "@/lib/prisma/client";

export async function toggleClassStatus(
  id: string,
  tenantId: string,
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

  if (
    classItem.tenantId !==
    tenantId
  ) {
    throw new Error(
      "Class belongs to another tenant"
    );
  }

  return prisma.class.update({
    where: {
      id: classItem.id,
    },

    data: {
      isActive:
        !classItem.isActive,
    },
  });
}