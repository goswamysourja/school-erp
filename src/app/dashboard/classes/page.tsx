import { Role } from "@prisma/client";

import { requireRole }
  from "@/modules/auth/guards/require-role.guard";

import { getClasses }
  from "@/modules/classes/services/get-classes.service";

import { ClassCard }
  from "@/components/classes/class-card";

import { PageHeader }
  from "@/components/ui/page-header";

import {
  Button,
  Stack,
} from "@mui/material";

import Link from "next/link";

export default async function ClassesPage() {
  await requireRole([
    Role.SUPER_ADMIN,
  ]);

  const classes =
    await getClasses();

  return (
    <>
      <PageHeader
        title="Classes"
        subtitle="Manage academic classes"
      />

      <Link href="/dashboard/classes/create">
        <Button
          variant="contained"
          sx={{ mb: 3 }}
        >
          Create Class
        </Button>
      </Link>

      <Stack spacing={2}>
        {classes.map(
          (classItem) => (
            <ClassCard
              key={classItem.id}
              classItem={classItem}
            />
          )
        )}
      </Stack>
    </>
  );
}