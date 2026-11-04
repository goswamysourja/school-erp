import { Role } from "@prisma/client";

import { prisma } from "@/lib/prisma/client";
import { getAuthUser } from "@/modules/auth/services/get-auth-user.service";

type LibraryApiAccessResult =
  | {
      authorized: true;
      user: NonNullable<Awaited<ReturnType<typeof getAuthUser>>>;
      tenantId: string;
    }
  | {
      authorized: false;
      status: 401 | 403 | 400;
      error: string;
    };

export async function authorizeLibraryApiAccess(): Promise<LibraryApiAccessResult> {
  const user = await getAuthUser();

  if (!user) {
    return {
      authorized: false,
      status: 401,
      error: "Authentication required.",
    };
  }

  // ADMIN has access to their own tenant's library.
  if (user.role === Role.ADMIN) {
    if (!user.tenantId) {
      return {
        authorized: false,
        status: 400,
        error: "Tenant assignment missing.",
      };
    }

    return {
      authorized: true,
      user,
      tenantId: user.tenantId,
    };
  }

  // STAFF and legacy TEACHER accounts require
  // an active library staff assignment.
  if (
    (user.role !== Role.STAFF && user.role !== Role.TEACHER) ||
    !user.tenantId
  ) {
    return {
      authorized: false,
      status: 403,
      error: "You do not have library access.",
    };
  }

  const assignment =
    await prisma.libraryStaffAssignment.findUnique({
      where: {
        tenantId_userId: {
          tenantId: user.tenantId,
          userId: user.id,
        },
      },
      select: {
        isActive: true,
      },
    });

  if (!assignment?.isActive) {
    return {
      authorized: false,
      status: 403,
      error: "You do not have library access.",
    };
  }

  return {
    authorized: true,
    user,
    tenantId: user.tenantId,
  };
}