import { Role } from "@prisma/client";

import { requireRole }
  from "@/modules/auth/guards/require-role.guard";

import { getClasses }
  from "@/modules/classes/services/get-classes.service";

import { CreateSectionForm }
  from "@/components/sections/create-section-form";

import { PageHeader }
  from "@/components/ui/page-header";

export default async function CreateSectionPage() {
  const currentUser =
    await requireRole([
      Role.ADMIN,
    ]);

  if (!currentUser.tenantId) {
    throw new Error(
      "Tenant assignment missing"
    );
  }

  const classes =
    await getClasses({
      tenantId:
        currentUser.tenantId,
    });

  return (
    <>
      <PageHeader
        title="Create Section"
        subtitle="Add a section to a class"
      />

      <CreateSectionForm
        classes={classes}
      />
    </>
  );
}