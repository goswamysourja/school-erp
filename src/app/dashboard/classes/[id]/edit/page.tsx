import { notFound } from "next/navigation";

import { Role } from "@prisma/client";

import { requireRole } from "@/modules/auth/guards/require-role.guard";

import { getClassById } from "@/modules/classes/services/get-class-by-id.service";

import { EditClassForm } from "@/components/classes/edit-class-form";

import { PageHeader } from "@/components/ui/page-header";

export default async function EditClassPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const currentUser =
    await requireRole([
      Role.ADMIN,
    ]);

  if (!currentUser.tenantId) {
    throw new Error(
      "Tenant assignment missing",
    );
  }

  const { id } =
    await params;

  const classItem =
    await getClassById(
      id,
      currentUser.tenantId,
    );

  if (!classItem) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title="Edit Class"
        subtitle="Update class details"
      />

      <EditClassForm
        id={classItem.id}
        initialName={
          classItem.name
        }
        initialAcademicYear={
          classItem.academicYear
        }
      />
    </>
  );
}