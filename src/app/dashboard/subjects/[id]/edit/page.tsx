import { notFound } from "next/navigation";

import { Role } from "@prisma/client";

import { PageHeader } from "@/components/ui/page-header";

import { EditSubjectForm } from "@/components/subjects/edit-subject-form";

import { getSubjectById } from "@/modules/subjects/services/get-subject-by-id.service";

import { requireRole } from "@/modules/auth/guards/require-role.guard";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditSubjectPage({
  params,
}: Props) {
  const currentUser =
    await requireRole([
      Role.ADMIN,
    ]);

  if (!currentUser.tenantId) {
    throw new Error(
      "Tenant assignment missing"
    );
  }

  const { id } =
    await params;

  const subject =
    await getSubjectById(
      id,
      currentUser.tenantId,
    );

  if (!subject) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title="Edit Subject"
        subtitle="Update subject details."
      />

      <EditSubjectForm
        id={subject.id}
        initialName={
          subject.name
        }
        initialCode={
          subject.code
        }
        initialDescription={
          subject.description ?? ""
        }
      />
    </>
  );
}