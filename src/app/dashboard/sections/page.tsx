import { Role } from "@prisma/client";

import { requireRole } from "@/modules/auth/guards/require-role.guard";

import { getSections } from "@/modules/sections/services/get-sections.service";

import { PageHeader } from "@/components/ui/page-header";

import {
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";

interface Props {
  searchParams: Promise<{
    classId?: string;
  }>;
}

export default async function SectionsPage({
  searchParams,
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

  const {
    classId,
  } = await searchParams;

  const sections =
    await getSections({
      tenantId:
        currentUser.tenantId,
      classId,
    });

  const selectedClass =
    sections[0]?.class;

  return (
    <>
      <PageHeader
        title={
          classId && selectedClass
            ? `Sections — Class ${selectedClass.name}`
            : "Sections"
        }
        subtitle={
          classId && selectedClass
            ? `Manage sections for Class ${selectedClass.name}`
            : "Manage class sections"
        }
      />

      <Stack
        direction="row"
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Button
          variant="contained"
          href={
            classId
              ? `/dashboard/sections/create?classId=${classId}`
              : "/dashboard/sections/create"
          }
        >
          Create Section
        </Button>

        {classId && (
          <Button
            variant="outlined"
            href="/dashboard/classes"
          >
            Back to Classes
          </Button>
        )}
      </Stack>

      <Stack spacing={2}>
        {sections.length === 0 ? (
          <Typography color="text.secondary">
            {classId
              ? "No sections found for this class."
              : "No sections found."}
          </Typography>
        ) : (
          sections.map((section) => (
            <Box
              key={section.id}
              sx={{
                p: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
              }}
            >
              <Typography variant="h6">
                Section {section.name}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Class: {section.class.name}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Academic Year:{" "}
                {section.class.academicYear}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Status:{" "}
                {section.isActive
                  ? "Active"
                  : "Inactive"}
              </Typography>

              <Button
                href={`/dashboard/sections/${section.id}/edit`}
                variant="outlined"
                size="small"
                sx={{ mt: 2 }}
              >
                Edit
              </Button>
            </Box>
          ))
        )}
      </Stack>
    </>
  );
}