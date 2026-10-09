import { Role } from "@prisma/client";

import { requireRole } from "@/modules/auth/guards/require-role.guard";

import { getAcademicYear } from "@/modules/academic-year/services/get.service";

import { AcademicYearForm } from "@/modules/academic-year/components/form";

import { PageHeader } from "@/components/ui/page-header";
import { SectionContainer } from "@/components/ui/section-container";

function formatDateForInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default async function EditAcademicYearPage({
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

  return (
    <>
      <PageHeader
        title="Edit Academic Year"
        subtitle="Update academic year details"
      />

      <SectionContainer>
        <AcademicYearForm
          academicYearId={academicYear.id}
          initialName={academicYear.name}
          initialStartDate={formatDateForInput(
            academicYear.startDate
          )}
          initialEndDate={formatDateForInput(
            academicYear.endDate
          )}
          initialIsActive={academicYear.isActive}
        />
      </SectionContainer>
    </>
  );
}