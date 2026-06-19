import { Role } from "@prisma/client";

import { requireRole }
  from "@/modules/auth/guards/require-role.guard";

import { getClassTenants }
  from "@/modules/classes/services/get-class-tenants.service";

import { getClassTeachers }
  from "@/modules/classes/services/get-class-teachers.service";

import { CreateClassForm }
  from "@/components/classes/create-class-form";

import { PageHeader }
  from "@/components/ui/page-header";

export default async function CreateClassPage() {
  await requireRole([
    Role.SUPER_ADMIN,
  ]);

  const tenants =
    await getClassTenants();

  const teachers =
    await getClassTeachers();

  return (
    <>
      <PageHeader
        title="Create Class"
        subtitle="Create a new academic class"
      />

      <CreateClassForm
        tenants={tenants}
        teachers={teachers}
      />
    </>
  );
}