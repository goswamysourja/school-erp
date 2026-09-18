"use client";

import { useState } from "react";

import {
  Alert,
  Button,
  Stack,
  TextField,
} from "@mui/material";

import { FormCard } from "@/components/ui/form-card";

interface Props {
  id: string;

  initialName: string;
  initialAcademicYear: string;
}

export function EditClassForm({
  id,
  initialName,
  initialAcademicYear,
}: Props) {
  const [name, setName] =
    useState(initialName);

  const [
    academicYear,
    setAcademicYear,
  ] = useState(
    initialAcademicYear
  );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

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
              academicYear,
            }),
          }
        );

      const data =
        await response.json();

      if (!data.success) {
        throw new Error(
          data.message
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

          <TextField
            label="Academic Year"
            fullWidth
            value={academicYear}
            onChange={(e) =>
              setAcademicYear(
                e.target.value
              )
            }
            required
          />

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
              disabled={loading}
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