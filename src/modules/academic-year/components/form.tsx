"use client";

import { useState } from "react";

import {
  Button,
  Stack,
  TextField,
} from "@mui/material";

import { useRouter } from "next/navigation";

import {
  createAcademicYear,
  toggleAcademicYear,
  updateAcademicYear,
} from "../api/api";

interface FormState {
  name: string;
  startDate: string;
  endDate: string;
}

interface AcademicYearFormProps {
  academicYearId?: string;
  initialName?: string;
  initialStartDate?: string;
  initialEndDate?: string;
  initialIsActive?: boolean;
}

export function AcademicYearForm({
  academicYearId,
  initialName = "",
  initialStartDate = "",
  initialEndDate = "",
  initialIsActive = true,
}: AcademicYearFormProps) {
  const router = useRouter();

  const isEdit = Boolean(academicYearId);

  const [form, setForm] = useState<FormState>({
    name: initialName,
    startDate: initialStartDate,
    endDate: initialEndDate,
  });

  const [isActive, setIsActive] =
    useState(initialIsActive);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toggling, setToggling] = useState(false);

  function updateField(
    field: keyof FormState,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!form.name.trim()) {
      setError("Academic year name is required.");
      return;
    }

    if (!form.startDate || !form.endDate) {
      setError(
        "Start date and end date are required."
      );
      return;
    }

    if (form.startDate >= form.endDate) {
      setError(
        "Academic year end date must be after the start date."
      );
      return;
    }

    try {
      setLoading(true);

      if (isEdit && academicYearId) {
        await updateAcademicYear(
          academicYearId,
          {
            name: form.name.trim(),
            startDate: form.startDate,
            endDate: form.endDate,
          }
        );
      } else {
        await createAcademicYear({
          name: form.name.trim(),
          startDate: form.startDate,
          endDate: form.endDate,
        });
      }

      router.push(
        isEdit
          ? `/dashboard/academic-years/${academicYearId}`
          : "/dashboard/academic-years"
      );

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleToggle() {
    if (!academicYearId) {
      return;
    }

    setError("");

    try {
      setToggling(true);

      const response =
        await toggleAcademicYear(
          academicYearId
        );

      if (response.academicYear) {
        setIsActive(
          response.academicYear.isActive
        );
      }

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setToggling(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <TextField
          label="Academic Year"
          value={form.name}
          onChange={(event) =>
            updateField(
              "name",
              event.target.value
            )
          }
          placeholder="2026–27"
          fullWidth
          required
        />

        <TextField
          label="Start Date"
          type="date"
          value={form.startDate}
          onChange={(event) =>
            updateField(
              "startDate",
              event.target.value
            )
          }
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          fullWidth
          required
        />

        <TextField
          label="End Date"
          type="date"
          value={form.endDate}
          onChange={(event) =>
            updateField(
              "endDate",
              event.target.value
            )
          }
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
          fullWidth
          required
        />

        {error && (
          <TextField
            label="Error"
            value={error}
            error
            multiline
            slotProps={{
              input: {
                readOnly: true,
              },
            }}
          />
        )}

        <Stack
          direction="row"
          spacing={2}
        >
          <Button
            type="submit"
            variant="contained"
            disabled={loading || toggling}
          >
            {loading
              ? isEdit
                ? "Saving..."
                : "Creating..."
              : isEdit
                ? "Save Changes"
                : "Create Academic Year"}
          </Button>

          {isEdit && (
            <Button
              type="button"
              variant="outlined"
              onClick={handleToggle}
              disabled={loading || toggling}
            >
              {toggling
                ? "Updating..."
                : isActive
                  ? "Set Inactive"
                  : "Set Active"}
            </Button>
          )}
        </Stack>
      </Stack>
    </form>
  );
}