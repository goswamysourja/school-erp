import { prisma } from "@/lib/prisma/client";

import {
  TENANT_ROLES,
} from "@/modules/auth/constants/platform.constants";

export async function getCurrentUser(
  userId: string,
) {
  const user =
    await prisma.user.findUnique({
      where: {
        id: userId,
      },

      include: {
        tenant: true,

        teacher: {
          include: {
            teachingAssignments: {
              include: {
                section: {
                  include: {
                    class: true,
                  },
                },
                subject: true,
              },
            },

            classTeacherAssignments: {
              include: {
                section: {
                  include: {
                    class: true,
                  },
                },
              },
            },
          },
        },
      },
    });

  if (!user) {
    throw new Error(
      "User not found",
    );
  }

  if (!user.isActive) {
    throw new Error(
      "User account inactive",
    );
  }

  if (
    user.tenant &&
    user.tenant.status !==
      "ACTIVE"
  ) {
    throw new Error(
      "Tenant inactive",
    );
  }

  if (
    TENANT_ROLES.includes(
      user.role as never,
    ) &&
    !user.tenantId
  ) {
    throw new Error(
      "Tenant assignment missing",
    );
  }

  return user;
}