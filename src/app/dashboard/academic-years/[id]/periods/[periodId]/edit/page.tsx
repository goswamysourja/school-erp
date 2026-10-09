import { Role } from "@prisma/client";

import { requireRole } from "@/modules/auth/guards/require-role.guard";

import { getAcademicYear } from "@/modules/academic-year/services/get.service";
import { getAcademicPeriod } from "@/modules/academic-year/services/period.get.service";

import { AcademicPeriodForm } from "@/modules/academic-year/components/period-form";

import { PageHeader } from "@/components/ui/page-header";
import { SectionContainer } from "@/components/ui/section-container";

function formatDateForInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

export default async function EditAcademicPeriodPage({
  params,
}: {
  params: Promise<{
    id: string;
    periodId: string;
  }>;
}) {
  const currentUser = await requireRole([
    Role.ADMIN,
  ]);

  if (!currentUser.tenantId) {
    throw new Error("Tenant assignment missing.");
  }

  const { id, periodId } = await params;

  const academicYear = await getAcademicYear({
    id,
    tenantId: currentUser.tenantId,
  });

  if (!academicYear) {
    return <h1>Academic year not found</h1>;
  }

  const academicPeriod = await getAcademicPeriod({
    id: periodId,
    academicYearId: academicYear.id,
    tenantId: currentUser.tenantId,
  });

  if (!academicPeriod) {
    return <h1>Academic period not found</h1>;
  }

  return (
    <>
      <PageHeader
        title="Edit Academic Period"
        subtitle={`Update ${academicPeriod.name} for ${academicYear.name}`}
      />

      <SectionContainer>
        <AcademicPeriodForm
          academicYearId={academicYear.id}
          periodId={academicPeriod.id}
          initialName={academicPeriod.name}
          initialType={academicPeriod.type}
          initialStartDate={formatDateForInput(
            academicPeriod.startDate
          )}
          initialEndDate={formatDateForInput(
            academicPeriod.endDate
          )}
        />
      </SectionContainer>
    </>
  );
}