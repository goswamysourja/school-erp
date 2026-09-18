import Link from "next/link";

import {
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";

import { Role } from "@prisma/client";

import { PageHeader }
  from "@/components/ui/page-header";

import { SubjectCard }
  from "@/components/subjects/subject-card";

import { getSubjects }
  from "@/modules/subjects/services/get-subjects.service";

import { requireRole }
  from "@/modules/auth/guards/require-role.guard";

export default async function SubjectsPage() {
  const currentUser =
    await requireRole([
      Role.ADMIN,
    ]);

  if (!currentUser.tenantId) {
    throw new Error(
      "Tenant assignment missing"
    );
  }

  const subjects =
    await getSubjects({
      tenantId:
        currentUser.tenantId,
    });

  return (
    <>
      <PageHeader
        title="Subject Management"
        subtitle="Manage subjects for your school."
      />

      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Link
          href="/dashboard/subjects/create"
          style={{
            textDecoration: "none",
          }}
        >
          <Button variant="contained">
            Create Subject
          </Button>
        </Link>
      </Box>

      {subjects.length === 0 ? (
        <Box
          sx={{
            py: 10,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h6"
            color="text.secondary"
          >
            No subjects found
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 1,
            }}
          >
            Click "Create Subject" to add your
            first subject.
          </Typography>
        </Box>
      ) : (
        <Stack spacing={3}>
          {subjects.map(
            (subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
              />
            )
          )}
        </Stack>
      )}
    </>
  );
}