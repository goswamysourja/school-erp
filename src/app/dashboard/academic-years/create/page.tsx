import { Role } from "@prisma/client";

import { requireRole } from "@/modules/auth/guards/require-role.guard";

import { AcademicYearForm } from "@/modules/academic-year/components/form";

import { PageHeader } from "@/components/ui/page-header";
import { SectionContainer } from "@/components/ui/section-container";

export default async function CreateAcademicYearPage() {
  await requireRole([
    Role.ADMIN,
  ]);

  return (
    <>
      <PageHeader
        title="Create Academic Year"
        subtitle="Set up a new academic year for your school"
      />

      <SectionContainer>
        <AcademicYearForm />
      </SectionContainer>
    </>
  );
}