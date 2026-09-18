"use client";

import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";

import { PageHeader } from "@/components/ui/page-header";

interface MySubjectAssignment {
  subject: {
    id: string;
    name: string;
    code: string;
    description: string | null;
    isActive: boolean;
  };

  section: {
    id: string;
    name: string;
    class: {
      id: string;
      name: string;
      academicYear: string;
    };
  };
}

interface Props {
  subjects: MySubjectAssignment[];
}

export function MySubjectsPage({
  subjects,
}: Props) {
  return (
    <>
      <PageHeader
        title="My Subjects"
        subtitle="Subjects assigned to you"
      />

      {subjects.length === 0 ? (
        <Typography color="text.secondary">
          No subjects have been assigned to you yet.
        </Typography>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {subjects.map(
            (assignment) => (
              <Card
                key={`${assignment.subject.id}-${assignment.section.id}`}
              >
                <CardContent>
                  <Stack spacing={1.5}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                      }}
                    >
                      {assignment.subject.name}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Code:{" "}
                      {assignment.subject.code}
                    </Typography>

                    <Typography>
                      Class:{" "}
                      {assignment.section.class.name}
                    </Typography>

                    <Typography>
                      Section:{" "}
                      {assignment.section.name}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Academic Year:{" "}
                      {
                        assignment.section.class
                          .academicYear
                      }
                    </Typography>

                    {assignment.subject.description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {
                          assignment.subject
                            .description
                        }
                      </Typography>
                    )}

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Status:{" "}
                      {assignment.subject.isActive
                        ? "Active"
                        : "Inactive"}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            ),
          )}
        </Box>
      )}
    </>
  );
}