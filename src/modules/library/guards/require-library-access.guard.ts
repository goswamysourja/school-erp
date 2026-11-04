import { redirect } from "next/navigation";

import { Role } from "@prisma/client";

import { prisma } from "@/lib/prisma/client";
import { getAuthUser } from "@/modules/auth/services/get-auth-user.service";

export async function requireLibraryAccess() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  // ADMIN has access to their own tenant's library.
  if (user.role === Role.ADMIN) {
    if (!user.tenantId) {
      redirect("/unauthorized");
    }

    return user;
  }

  // STAFF and legacy TEACHER accounts must have
  // an active library assignment.
  if (
    (user.role !== Role.STAFF && user.role !== Role.TEACHER) ||
    !user.tenantId
  ) {
    redirect("/unauthorized");
  }

  const libraryStaff =
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

  if (!libraryStaff?.isActive) {
    redirect("/unauthorized");
  }

  return user;
}