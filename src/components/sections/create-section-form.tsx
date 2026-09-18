"use client";

import { useState } from "react";

import {
  Alert,
  Button,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";

import { FormCard }
  from "@/components/ui/form-card";

interface ClassItem {
  id: string;
  name: string;
  academicYear: string;
}

interface Props {
  classes: ClassItem[];
}

export function CreateSectionForm({
  classes,
}: Props) {
  const [name, setName] =
    useState("");

  const [classId, setClassId] =
    useState("");

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
          "/api/sections",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              name,
              classId,
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
        "/dashboard/sections";
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create section"
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
            select
            label="Class"
            value={classId}
            onChange={(e) =>
              setClassId(
                e.target.value
              )
            }
            fullWidth
            required
          >
            {classes.map(
              (classItem) => (
                <MenuItem
                  key={classItem.id}
                  value={classItem.id}
                >
                  {classItem.name}
                  {" - "}
                  {
                    classItem.academicYear
                  }
                </MenuItem>
              )
            )}
          </TextField>

          <TextField
            label="Section Name"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            fullWidth
            required
          />

          <Stack
            direction="row"
            spacing={2}
          >
            <Button
              variant="outlined"
              href="/dashboard/sections"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "Create Section"}
            </Button>
          </Stack>
        </Stack>
      </form>
    </FormCard>
  );
}