import { Role } from "@prisma/client";

import { requireRole } from "@/modules/auth/guards/require-role.guard";

import { getMyClassDetails } from "@/modules/teacher/services";

import { PageHeader } from "@/components/ui/page-header";

import {
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

interface Props {
  params: Promise<{
    sectionId: string;
  }>;
}

export default async function MyClassSectionPage({
  params,
}: Props) {
  const currentUser =
    await requireRole([
      Role.TEACHER,
    ]);

  const { sectionId } =
    await params;

  const classDetails =
    await getMyClassDetails(
      currentUser.id,
      sectionId,
    );

  return (
    <>
      <PageHeader
        title={`Class ${classDetails.class.name} — Section ${classDetails.name}`}
        subtitle={`Academic Year: ${classDetails.class.academicYear}`}
      />

      <Stack spacing={3}>
        {classDetails.isClassTeacher && (
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  Class Teacher
                </Typography>

                <Typography>
                  You are the Class Teacher for
                  this section.
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent>
            <Stack spacing={1}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                }}
              >
                Section Overview
              </Typography>

              <Typography>
                Class:{" "}
                {classDetails.class.name}
              </Typography>

              <Typography>
                Section:{" "}
                {classDetails.name}
              </Typography>

              <Typography>
                Academic Year:{" "}
                {classDetails.class.academicYear}
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              mb: 2,
            }}
          >
            Subjects in This Section
          </Typography>

          {classDetails.subjects.length ===
            0 ? (
            <Typography color="text.secondary">
              No subjects have been assigned
              to this section yet.
            </Typography>
          ) : (
            <Stack spacing={2}>
              {classDetails.subjects.map(
                (subject) => (
                  <Card key={subject.id}>
                    <CardContent>
                      <Stack
                        spacing={1.5}
                      >
                        <Stack
                          direction="row"
                          spacing={1}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                            }}
                          >
                            {subject.name}
                          </Typography>

                          {subject.isMine && (
                            <Chip
                              label="You Teach This"
                              size="small"
                            />
                          )}
                        </Stack>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          Code:{" "}
                          {subject.code}
                        </Typography>

                        <Typography>
                          Teacher:{" "}
                          {subject.teacherName}
                        </Typography>

                        {!subject.isMine && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            View only
                          </Typography>
                        )}

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          Status:{" "}
                          {subject.isActive
                            ? "Active"
                            : "Inactive"}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                ),
              )}
            </Stack>
          )}
        </Box>
      </Stack>
    </>
  );
}