"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

interface AcademicYearOption {
  id: string;
  name: string;
}

interface AcademicYearsResponse {
  success: boolean;
  message?: string;
  academicYears?: AcademicYearOption[];
}

export function CreateClassForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [academicYearId, setAcademicYearId] = useState("");
  const [academicYears, setAcademicYears] = useState<
    AcademicYearOption[]
  >([]);

  const [loadingYears, setLoadingYears] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAcademicYears() {
      try {
        setLoadingYears(true);
        setError("");

        const response = await fetch("/api/academic-years");

        const data: AcademicYearsResponse =
          await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ?? "Failed to load academic years.",
          );
        }

        setAcademicYears(data.academicYears ?? []);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load academic years.",
        );
      } finally {
        setLoadingYears(false);
      }
    }

    loadAcademicYears();
  }, []);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Please enter a class name.");
      return;
    }

    const selectedAcademicYear = academicYears.find(
      (academicYear) => academicYear.id === academicYearId,
    );

    if (!selectedAcademicYear) {
      setError("Please select an academic year.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          academicYear: selectedAcademicYear.name,
          academicYearId,
        }),
      });

      const data = (await response.json().catch(() => null)) as {
        success?: boolean;
        message?: string;
        error?: string;
      } | null;

      if (!response.ok || data?.success !== true) {
        throw new Error(
          data?.message ??
            data?.error ??
            "Failed to create class.",
        );
      }

      router.push("/dashboard/classes");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create class.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 700,
      }}
    >
      <Card
        elevation={0}
        sx={{
          width: "100%",
          border: 1,
          borderColor: "divider",
          borderRadius: 3,
          overflow: "hidden",
          bgcolor: "background.paper",
        }}
      >
        <CardContent
          sx={{
            p: {
              xs: 2.5,
              sm: 3.5,
            },
            "&:last-child": {
              pb: {
                xs: 2.5,
                sm: 3.5,
              },
            },
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
          >
            <Stack spacing={3}>
              {/* Header */}
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    letterSpacing: "-0.2px",
                  }}
                >
                  Class Details
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 0.5,
                  }}
                >
                  Define the name and academic period for the
                  new class.
                </Typography>
              </Box>

              {/* Error */}
              {error && (
                <Alert
                  severity="error"
                  onClose={() => setError("")}
                  sx={{
                    borderRadius: 2,
                  }}
                >
                  {error}
                </Alert>
              )}

              {/* Fields */}
              <Stack spacing={2.5}>
                <TextField
                  id="class-name"
                  label="Class Name"
                  fullWidth
                  required
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  disabled={loading}
                  placeholder="e.g. Class X"
                  autoComplete="off"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />

                <FormControl
                  fullWidth
                  required
                  disabled={loadingYears || loading}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                >
                  <InputLabel id="academic-year-label">
                    Academic Year
                  </InputLabel>

                  <Select
                    labelId="academic-year-label"
                    id="academic-year"
                    value={academicYearId}
                    label="Academic Year"
                    onChange={(event) =>
                      setAcademicYearId(event.target.value)
                    }
                  >
                    {academicYears.map((academicYear) => (
                      <MenuItem
                        key={academicYear.id}
                        value={academicYear.id}
                      >
                        {academicYear.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>

              <Divider />

              {/* Actions */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: {
                    xs: "column-reverse",
                    sm: "row",
                  },
                  gap: 1.5,
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  href="/dashboard/classes"
                  variant="outlined"
                  color="inherit"
                  disabled={loading}
                  sx={{
                    minHeight: 44,
                    px: 3,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  disabled={
                    loading ||
                    loadingYears ||
                    academicYears.length === 0 ||
                    !name.trim() ||
                    !academicYearId
                  }
                  startIcon={<AddIcon />}
                  sx={{
                    minHeight: 44,
                    px: 3,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    boxShadow: "none",
                    "&:hover": {
                      boxShadow: "none",
                    },
                  }}
                >
                  {loading ? "Creating..." : "Create Class"}
                </Button>
              </Box>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}