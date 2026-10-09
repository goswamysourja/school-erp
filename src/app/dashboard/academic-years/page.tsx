import { Role } from "@prisma/client";

import { requireRole } from "@/modules/auth/guards/require-role.guard";

import { getAcademicYears } from "@/modules/academic-year/services/get.service";

import { AcademicYearList } from "@/modules/academic-year/pages/list";

export default async function AcademicYearsPage() {
  const currentUser = await requireRole([
    Role.ADMIN,
  ]);

  if (!currentUser.tenantId) {
    throw new Error("Tenant assignment missing.");
  }

  const academicYears = await getAcademicYears({
    tenantId: currentUser.tenantId,
  });

  return (
    <AcademicYearList
      academicYears={academicYears}
    />
  );
}