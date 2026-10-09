import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import type { AcademicYearResponse } from "../types/types";

interface AcademicYearListProps {
  academicYears: AcademicYearResponse[];
}

export function AcademicYearList({
  academicYears,
}: AcademicYearListProps) {
  return (
    <Stack spacing={3}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5">
            Academic Years
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Manage academic years and their terms and exams.
          </Typography>
        </Box>

        <Button
          href="/dashboard/academic-years/create"
          variant="contained"
        >
          Create Academic Year
        </Button>
      </Box>

      {academicYears.length === 0 ? (
        <Card>
          <CardContent>
            <Typography color="text.secondary">
              No academic years have been created yet.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {academicYears.map((academicYear) => (
            <Grid
              key={academicYear.id}
              size={{ xs: 12, md: 6 }}
            >
              <Card>
                <CardContent>
                  <Stack spacing={2}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Typography variant="h6">
                        {academicYear.name}
                      </Typography>

                      <Chip
                        label={
                          academicYear.isActive
                            ? "Active"
                            : "Inactive"
                        }
                        color={
                          academicYear.isActive
                            ? "success"
                            : "default"
                        }
                        size="small"
                      />
                    </Box>

                    <Stack spacing={0.5}>
                      <Typography variant="body2">
                        <strong>Start:</strong>{" "}
                        {academicYear.startDate.toLocaleDateString(
                          "en-IN"
                        )}
                      </Typography>

                      <Typography variant="body2">
                        <strong>End:</strong>{" "}
                        {academicYear.endDate.toLocaleDateString(
                          "en-IN"
                        )}
                      </Typography>
                    </Stack>

                    <Button
                      href={`/dashboard/academic-years/${academicYear.id}`}
                      variant="outlined"
                    >
                      Manage
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Stack>
  );
}