import { Role } from "@prisma/client";

import { prisma } from "@/lib/prisma/client";

interface AssignLibraryStaffInput {
  tenantId: string;
  userId: string;
}

export async function assignLibraryStaff(
  input: AssignLibraryStaffInput,
) {
  const tenant = await prisma.tenant.findUnique({
    where: {
      id: input.tenantId,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (!tenant) {
    throw new Error("Tenant not found.");
  }

  if (tenant.status !== "ACTIVE") {
    throw new Error("Tenant is inactive.");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: input.userId,
    },
    select: {
      id: true,
      name: true,
      phone: true,
      role: true,
      tenantId: true,
      isActive: true,
    },
  });

  if (!user || user.tenantId !== input.tenantId) {
    throw new Error(
      "Staff member does not belong to this institution.",
    );
  }

  if (
    user.role !== Role.STAFF &&
    user.role !== Role.TEACHER
  ) {
    throw new Error(
      "Only staff members can be assigned to library responsibilities.",
    );
  }

  if (!user.isActive) {
    throw new Error("Staff member is inactive.");
  }

  return prisma.libraryStaffAssignment.upsert({
    where: {
      tenantId_userId: {
        tenantId: input.tenantId,
        userId: input.userId,
      },
    },

    create: {
      tenantId: input.tenantId,
      userId: input.userId,
      isActive: true,
    },

    update: {
      isActive: true,
    },

    include: {
      user: {
        select: {
          id: true,
          name: true,
          phone: true,
          role: true,
          isActive: true,
        },
      },
    },
  });
}