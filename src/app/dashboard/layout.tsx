import { Role } from "@prisma/client";

import { prisma } from "@/lib/prisma/client";

import { DashboardShell } from "@/components/layout/dashboard-shell";

import { getAuthUser } from "@/modules/auth/services/get-auth-user.service";
import { requireAuth } from "@/modules/auth/guards/require-auth.guard";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  const user = await getAuthUser();

  if (!user) {
    return null;
  }

  let hasLibraryAccess = false;

  // ADMIN automatically has access to their tenant's library.
  if (user.role === Role.ADMIN && user.tenantId) {
    hasLibraryAccess = true;
  }

  // STAFF and legacy TEACHER accounts require
  // an active LibraryStaffAssignment.
  else if (
    (user.role === Role.STAFF || user.role === Role.TEACHER) &&
    user.tenantId
  ) {
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

    hasLibraryAccess = assignment?.isActive === true;
  }

  return (
    <DashboardShell
      user={{
        name: user.name,
        role: user.role,
        designation: user.designation,
      }}
      hasLibraryAccess={hasLibraryAccess}
    >
      {children}
    </DashboardShell>
  );
}