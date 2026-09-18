import { Role } from "@prisma/client";

import { requireRole }
  from "@/modules/auth/guards/require-role.guard";

import { listTeachers }
  from "@/modules/teacher/services";

import { getSections }
  from "@/modules/sections/services/get-sections.service";

import { getSubjects }
  from "@/modules/subjects/services/get-subjects.service";

import { CreateTeachingAssignmentForm }
  from "@/components/teaching-assignment/create-form";

import { PageHeader }
  from "@/components/ui/page-header";

export default async function CreateTeachingAssignmentPage() {
  const currentUser =
    await requireRole([
      Role.ADMIN,
    ]);

  if (!currentUser.tenantId) {
    throw new Error(
      "Tenant assignment missing",
    );
  }

  const tenantId =
    currentUser.tenantId;

  const [
    teachers,
    sections,
    subjects,
  ] = await Promise.all([
    listTeachers(tenantId),

    getSections({
      tenantId,
    }),

    getSubjects({
      tenantId,
    }),
  ]);

  return (
    <>
      <PageHeader
        title="Create Teaching Assignment"
        subtitle="Assign a teacher to a subject and section."
      />

      <CreateTeachingAssignmentForm
        teachers={teachers}
        sections={sections}
        subjects={subjects}
      />
    </>
  );
}