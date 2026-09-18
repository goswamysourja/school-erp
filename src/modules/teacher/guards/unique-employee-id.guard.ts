import { prisma } from "@/lib/prisma/client";

export async function requireUniqueEmployeeId(
  employeeId: string,
  tenantId: string,
  excludeTeacherId?: string,
): Promise<void> {
  const teacher = await prisma.teacher.findFirst({
    where: {
      employeeId,
      tenantId,
    },
  });

  if (!teacher) {
    return;
  }

  if (
    excludeTeacherId &&
    teacher.id === excludeTeacherId
  ) {
    return;
  }

  throw new Error("Employee ID already exists.");
}