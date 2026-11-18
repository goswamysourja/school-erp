
import { Role } from "@prisma/client";

import { prisma } from "@/lib/prisma/client";

import { DashboardShell } from "@/components/layout/dashboard-shell";

import { requireAuth } from "@/modules/auth/guards/require-auth.guard";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();

  let hasLibraryAccess = false;

  if (user.role === Role.ADMIN && user.tenantId) {
    hasLibraryAccess = true;
  } else if (
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
