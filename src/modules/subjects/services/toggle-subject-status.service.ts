import { prisma } from "@/lib/prisma/client";

export async function toggleSubjectStatus(
  id: string,
  tenantId: string,
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

  if (
    subject.tenantId !==
    tenantId
  ) {
    throw new Error(
      "Subject belongs to another tenant"
    );
  }

  return prisma.subject.update({
    where: {
      id: subject.id,
    },

    data: {
      isActive:
        !subject.isActive,
    },
  });
}