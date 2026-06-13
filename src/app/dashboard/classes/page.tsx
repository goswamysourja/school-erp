import { Role } from "@prisma/client";

import { requireRole } from "@/modules/auth/guards/require-role.guard";

import { getClasses } from "@/modules/classes/services/get-classes.service";

import { ClassCard } from "@/components/classes/class-card";

export default async function ClassesPage() {
  await requireRole([
    Role.SUPER_ADMIN,
  ]);

  const classes =
    await getClasses();

  return (
    <main>
      <h1>
        Classes
      </h1>

      {classes.map(
        (classItem) => (
          <ClassCard
            key={classItem.id}
            classItem={classItem}
          />
        )
      )}
    </main>
  );
}