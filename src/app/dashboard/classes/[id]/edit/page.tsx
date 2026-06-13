import { Role } from "@prisma/client";

import { requireRole } from "@/modules/auth/guards/require-role.guard";

import { getClassById } from "@/modules/classes/services/get-class-by-id.service";

import { getClassTeachers } from "@/modules/classes/services/get-class-teachers.service";

import { getClassTenants } from "@/modules/classes/services/get-class-tenants.service";

import { EditClassForm } from "@/components/classes/edit-class-form";

export default async function EditClassPage(
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  await requireRole([
    Role.SUPER_ADMIN,
  ]);

  const { id } =
    await params;

  const classItem =
    await getClassById(id);

  const tenants =
    await getClassTenants();

  const teachers =
    await getClassTeachers();

  if (!classItem) {
    return (
      <h1>
        Class not found
      </h1>
    );
  }

  return (
    <main>
      <h1>
        Edit Class
      </h1>

      <EditClassForm
        id={classItem.id}
        initialName={
          classItem.name
        }
        initialSection={
          classItem.section
        }
        initialAcademicYear={
          classItem.academicYear
        }
        initialTenantId={
          classItem.tenantId
        }
        initialClassTeacherId={
          classItem.classTeacherId ??
          ""
        }
        tenants={tenants}
        teachers={teachers}
      />
    </main>
  );
}