import { Role } from "@prisma/client";

import { requireRole } from "@/modules/auth/guards/require-role.guard";

import { getAcademicYear } from "@/modules/academic-year/services/get.service";
import { getAcademicPeriods } from "@/modules/academic-year/services/period.get.service";

import { AcademicYearDetail } from "@/modules/academic-year/pages/detail";

import { PageHeader } from "@/components/ui/page-header";

export default async function AcademicYearPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const currentUser = await requireRole([
    Role.ADMIN,
  ]);

  if (!currentUser.tenantId) {
    throw new Error("Tenant assignment missing.");
  }

  const { id } = await params;

  const academicYear = await getAcademicYear({
    id,
    tenantId: currentUser.tenantId,
  });

  if (!academicYear) {
    return <h1>Academic year not found</h1>;
  }

  const periods = await getAcademicPeriods({
    academicYearId: id,
    tenantId: currentUser.tenantId,
  });

  return (
    <>
      <PageHeader
        title="Academic Year"
        subtitle="Manage academic year details and academic periods"
      />

      <AcademicYearDetail
        academicYear={academicYear}
        periods={periods}
      />
    </>
  );
}