import { prisma } from "@/lib/prisma/client";

export async function getSubjectById(
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
    return null;
  }

  if (
    subject.tenantId !==
    tenantId
  ) {
    return null;
  }

  return subject;
}