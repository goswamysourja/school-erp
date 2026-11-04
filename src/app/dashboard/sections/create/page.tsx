import { Role } from "@prisma/client";
import { requireRole } from "@/modules/auth/guards/require-role.guard";
import { getClasses } from "@/modules/classes/services/get-classes.service";
import { CreateSectionForm } from "@/components/sections/create-section-form";
import { PageHeader } from "@/components/ui/page-header";
import { Stack } from "@mui/material";

interface Props {
  searchParams: Promise<{ classId?: string }>;
}

export default async function CreateSectionPage({ searchParams }: Props) {
  const currentUser = await requireRole([Role.ADMIN]);

  if (!currentUser.tenantId) {
    throw new Error("Tenant assignment missing");
  }

  const { classId } = await searchParams;

  const classes = await getClasses({
    tenantId: currentUser.tenantId,
  });

  return (
    <Stack spacing={3.5} sx={{ pb: 4 }}>
      <PageHeader
        title="Create Section"
        subtitle="Add a section to an existing class"
      />
      <CreateSectionForm classes={classes} initialClassId={classId} />
    </Stack>
  );
}