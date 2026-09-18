import { Role } from "@prisma/client";

import { prisma } from "@/lib/prisma/client";

import {
  requireUserExists,
  requireUserRole,
} from "@/modules/users/guards";

export async function requireEligibleTeacherUser(
  userId: string,
  tenantId: string,
) {
  const user =
    await requireUserExists(
      userId,
    );

  requireUserRole(
    user,
    Role.TEACHER,
  );

  if (!user.isActive) {
    throw new Error(
      "User is inactive.",
    );
  }

  if (!user.tenantId) {
    throw new Error(
      "Teacher user is not assigned to a tenant.",
    );
  }

  if (
    user.tenantId !==
    tenantId
  ) {
    throw new Error(
      "Teacher user belongs to another tenant.",
    );
  }

  const existingTeacher =
    await prisma.teacher.findUnique({
      where: {
        userId,
      },
      select: {
        id: true,
      },
    });

  if (existingTeacher) {
    throw new Error(
      "User is already linked to a teacher.",
    );
  }

  return user;
}