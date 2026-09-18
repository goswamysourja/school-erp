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

import {
  createClassTeacherAssignment,
} from "@/modules/class-teacher-assignment/api";

interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
}

interface Section {
  id: string;
  name: string;
  class: {
    name: string;
    academicYear: string;
  };
}

interface Props {
  teachers: Teacher[];
  sections: Section[];
}

export function CreateClassTeacherAssignmentForm({
  teachers,
  sections,
}: Props) {
  const [teacherId, setTeacherId] =
    useState("");

  const [sectionId, setSectionId] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    e: React.FormEvent,
  ) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await createClassTeacherAssignment({
        teacherId,
        sectionId,
      });

      window.location.href =
        "/dashboard/class-teacher-assignment";
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to assign class teacher",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormCard>
      <form
        onSubmit={handleSubmit}
      >
        <Stack spacing={3}>
          {error && (
            <Alert severity="error">
              {error}
            </Alert>
          )}

          <TextField
            select
            label="Teacher"
            value={teacherId}
            onChange={(e) =>
              setTeacherId(
                e.target.value,
              )
            }
            fullWidth
            required
          >
            <MenuItem
              value=""
              disabled
            >
              Select Teacher
            </MenuItem>

            {teachers.map(
              (teacher) => (
                <MenuItem
                  key={teacher.id}
                  value={teacher.id}
                >
                  {teacher.firstName}{" "}
                  {teacher.lastName}
                </MenuItem>
              ),
            )}
          </TextField>

          <TextField
            select
            label="Section"
            value={sectionId}
            onChange={(e) =>
              setSectionId(
                e.target.value,
              )
            }
            fullWidth
            required
          >
            <MenuItem
              value=""
              disabled
            >
              Select Section
            </MenuItem>

            {sections.map(
              (section) => (
                <MenuItem
                  key={section.id}
                  value={section.id}
                >
                  {section.class.name}
                  {" - "}
                  {section.name}
                  {" ("}
                  {
                    section.class
                      .academicYear
                  }
                  {")"}
                </MenuItem>
              ),
            )}
          </TextField>

          <Stack
            direction="row"
            spacing={2}
          >
            <Button
              variant="outlined"
              onClick={() =>
                window.history.back()
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading
                ? "Assigning..."
                : "Assign Class Teacher"}
            </Button>
          </Stack>
        </Stack>
      </form>
    </FormCard>
  );
}