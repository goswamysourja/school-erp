import { prisma } from "@/lib/prisma/client";

export async function getSectionById(
  id: string,
  tenantId: string,
) {
  const section =
    await prisma.section.findUnique({
      where: {
        id,
      },

      include: {
        class: true,
      },
    });

  if (!section) {
    return null;
  }

  if (
    section.tenantId !==
    tenantId
  ) {
    return null;
  }

  return section;
}