import { notFound } from "next/navigation";

import { Role } from "@prisma/client";

import { requireRole } from "@/modules/auth/guards/require-role.guard";

import { getSectionById } from "@/modules/sections/services/get-section-by-id.service";

import { EditSectionForm } from "@/components/sections/edit-section-form";

import { PageHeader } from "@/components/ui/page-header";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditSectionPage({
  params,
}: Props) {
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

  const section =
    await getSectionById(
      id,
      currentUser.tenantId,
    );

  if (!section) {
    notFound();
  }

  return (
    <>
      <PageHeader
        title="Edit Section"
        subtitle="Update section details"
      />

      <EditSectionForm
        id={section.id}
        initialName={section.name}
      />
    </>
  );
}