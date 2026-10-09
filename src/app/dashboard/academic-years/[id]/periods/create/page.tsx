import { Role } from "@prisma/client";

import { requireRole } from "@/modules/auth/guards/require-role.guard";

import { getAcademicYear } from "@/modules/academic-year/services/get.service";

import { AcademicPeriodForm } from "@/modules/academic-year/components/period-form";

import { PageHeader } from "@/components/ui/page-header";
import { SectionContainer } from "@/components/ui/section-container";

export default async function CreateAcademicPeriodPage({
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
        title="Create Academic Period"
        subtitle={`Add a term or exam for ${academicYear.name}`}
      />

      <SectionContainer>
        <AcademicPeriodForm
          academicYearId={academicYear.id}
        />
      </SectionContainer>
    </>
  );
}