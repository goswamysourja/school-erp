import { notFound } from "next/navigation";

import { Role } from "@prisma/client";

import { requireRole }
  from "@/modules/auth/guards/require-role.guard";

import { getTeachingAssignment }
  from "@/modules/teaching-assignment/services";

import { listTeachers }
  from "@/modules/teacher/services";

import { getSections }
  from "@/modules/sections/services/get-sections.service";

import { getSubjects }
  from "@/modules/subjects/services/get-subjects.service";

import { EditTeachingAssignmentForm }
  from "@/components/teaching-assignment/edit-form";

import { PageHeader }
  from "@/components/ui/page-header";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditTeachingAssignmentPage({
  params,
}: Props) {
  const currentUser =
    await requireRole([
      Role.ADMIN,
    ]);

  if (!currentUser.tenantId) {
    throw new Error(
      "Tenant assignment missing.",
    );
  }

  const { id } =
    await params;

  const tenantId =
    currentUser.tenantId;

  const assignment =
    await getTeachingAssignment(
      id,
      tenantId,
    );

  if (!assignment) {
    notFound();
  }

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
        title="Edit Teaching Assignment"
        subtitle="Update teacher, subject, or section assignment."
      />

      <EditTeachingAssignmentForm
        id={assignment.id}
        initialTeacherId={
          assignment.teacherId
        }
        initialSectionId={
          assignment.sectionId
        }
        initialSubjectId={
          assignment.subjectId
        }
        teachers={teachers}
        sections={sections}
        subjects={subjects}
      />
    </>
  );
}