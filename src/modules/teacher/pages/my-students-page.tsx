"use client";

import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";

import { PageHeader } from "@/components/ui/page-header";

interface MyStudent {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  gender: string;
  guardianName: string | null;
  phone: string | null;
  isActive: boolean;
  section: {
    name: string;
    class: {
      name: string;
      academicYear: string;
    };
  } | null;
}

interface Props {
  students: MyStudent[];
}

export function MyStudentsPage({
  students,
}: Props) {
  return (
    <>
      <PageHeader
        title="My Students"
        subtitle="Students from your assigned sections"
      />

      {students.length === 0 ? (
        <Typography color="text.secondary">
          No students have been assigned to your sections yet.
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
          {students.map((student) => (
            <Card key={student.id}>
              <CardContent>
                <Stack spacing={1.5}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    {student.firstName}{" "}
                    {student.lastName}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Admission No:{" "}
                    {student.admissionNumber}
                  </Typography>

                  {student.section && (
                    <>
                      <Typography>
                        Class:{" "}
                        {
                          student.section.class
                            .name
                        }
                      </Typography>

                      <Typography>
                        Section:{" "}
                        {student.section.name}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Academic Year:{" "}
                        {
                          student.section.class
                            .academicYear
                        }
                      </Typography>
                    </>
                  )}

                  <Typography>
                    Gender: {student.gender}
                  </Typography>

                  {student.guardianName && (
                    <Typography>
                      Guardian:{" "}
                      {student.guardianName}
                    </Typography>
                  )}

                  {student.phone && (
                    <Typography>
                      Phone: {student.phone}
                    </Typography>
                  )}

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Status:{" "}
                    {student.isActive
                      ? "Active"
                      : "Inactive"}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </>
  );
}