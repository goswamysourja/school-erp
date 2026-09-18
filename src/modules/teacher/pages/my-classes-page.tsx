"use client";

import { useRouter } from "next/navigation";

import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";

import { PageHeader } from "@/components/ui/page-header";

interface MyClassSection {
  id: string;
  name: string;
  class: {
    name: string;
    academicYear: string;
  };
}

interface Props {
  sections: MyClassSection[];
}

export function MyClassesPage({
  sections,
}: Props) {
  const router = useRouter();

  return (
    <>
      <PageHeader
        title="My Classes"
        subtitle="Classes and sections assigned to you"
      />

      {sections.length === 0 ? (
        <Typography color="text.secondary">
          No classes have been assigned to you yet.
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
          {sections.map((section) => (
            <Card
              key={section.id}
              sx={{
                cursor: "pointer",
              }}
              onClick={() =>
                router.push(
                  `/dashboard/my-classes/${section.id}`,
                )
              }
            >
              <CardContent>
                <Stack spacing={1}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    Class {section.class.name}
                  </Typography>

                  <Typography>
                    Section {section.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Academic Year:{" "}
                    {section.class.academicYear}
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