import { prisma } from "@/lib/prisma/client";

export async function getClassById(
  id: string,
  tenantId: string,
) {
  const classItem =
    await prisma.class.findUnique({
      where: {
        id,
      },

      include: {
        sections: true,
      },
    });

  if (!classItem) {
    return null;
  }

  if (
    classItem.tenantId !==
    tenantId
  ) {
    return null;
  }

  return classItem;
}