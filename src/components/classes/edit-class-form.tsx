"use client";

import { useEffect, useState } from "react";

import {
  Alert,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";

import { FormCard } from "@/components/ui/form-card";

interface AcademicYearOption {
  id: string;
  name: string;
}

interface AcademicYearsResponse {
  success: boolean;
  message?: string;
  academicYears?: AcademicYearOption[];
}

interface Props {
  id: string;

  initialName: string;

  initialAcademicYear: string;

  initialAcademicYearId?: string;
}

export function EditClassForm({
  id,
  initialName,
  initialAcademicYear,
  initialAcademicYearId,
}: Props) {
  const [name, setName] =
    useState(initialName);

  const [
    academicYearId,
    setAcademicYearId,
  ] = useState(
    initialAcademicYearId ?? ""
  );

  const [
    academicYears,
    setAcademicYears,
  ] = useState<AcademicYearOption[]>([]);

  const [loadingYears, setLoadingYears] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadAcademicYears() {
      try {
        setLoadingYears(true);
        setError("");

        const response =
          await fetch(
            "/api/academic-years"
          );

        const data: AcademicYearsResponse =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ??
              "Failed to load academic years"
          );
        }

        const years =
          data.academicYears ?? [];

        setAcademicYears(years);

        if (!initialAcademicYearId) {
          const matchingYear =
            years.find(
              (academicYear) =>
                academicYear.name ===
                initialAcademicYear
            );

          if (matchingYear) {
            setAcademicYearId(
              matchingYear.id
            );
          }
        }
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load academic years"
        );
      } finally {
        setLoadingYears(false);
      }
    }

    loadAcademicYears();
  }, [
    initialAcademicYear,
    initialAcademicYearId,
  ]);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const selectedAcademicYear =
        academicYears.find(
          (academicYear) =>
            academicYear.id ===
            academicYearId
        );

      if (!selectedAcademicYear) {
        throw new Error(
          "Please select an academic year."
        );
      }

      const response =
        await fetch(
          `/api/classes/${id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              name,
              academicYear:
                selectedAcademicYear.name,
              academicYearId:
                selectedAcademicYear.id,
            }),
          }
        );

      const data =
        await response.json();

      if (!data.success) {
        throw new Error(
          data.message ??
            "Failed to update class"
        );
      }

      window.location.href =
        "/dashboard/classes";
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update class"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormCard>
      <form
        onSubmit={
          handleSubmit
        }
      >
        <Stack spacing={3}>
          {error && (
            <Alert severity="error">
              {error}
            </Alert>
          )}

          <TextField
            label="Class Name"
            fullWidth
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            required
          />

          <FormControl
            fullWidth
            required
            disabled={
              loadingYears ||
              loading
            }
          >
            <InputLabel id="academic-year-label">
              Academic Year
            </InputLabel>

            <Select
              labelId="academic-year-label"
              value={academicYearId}
              label="Academic Year"
              onChange={(e) =>
                setAcademicYearId(
                  e.target.value
                )
              }
            >
              {academicYears.map(
                (academicYear) => (
                  <MenuItem
                    key={
                      academicYear.id
                    }
                    value={
                      academicYear.id
                    }
                  >
                    {academicYear.name}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>

          <Stack
            direction="row"
            spacing={2}
          >
            <Button
              variant="outlined"
              href="/dashboard/classes"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={
                loading ||
                loadingYears ||
                academicYears.length ===
                  0 ||
                !academicYearId
              }
            >
              {loading
                ? "Saving..."
                : "Save Changes"}
            </Button>
          </Stack>
        </Stack>
      </form>
    </FormCard>
  );
}