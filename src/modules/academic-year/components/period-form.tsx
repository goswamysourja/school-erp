"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  createAcademicPeriod,
  updateAcademicPeriod,
} from "@/modules/academic-year/api/api";

type PeriodType = "TERM" | "EXAM";

interface AcademicPeriodFormProps {
  academicYearId: string;
  periodId?: string;
  initialName?: string;
  initialType?: PeriodType;
  initialStartDate?: string;
  initialEndDate?: string;
}

export function AcademicPeriodForm({
  academicYearId,
  periodId,
  initialName = "",
  initialType = "TERM",
  initialStartDate = "",
  initialEndDate = "",
}: AcademicPeriodFormProps) {
  const router = useRouter();

  const [name, setName] = useState(initialName);
  const [type, setType] = useState<PeriodType>(initialType);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEdit = Boolean(periodId);

  async function handleSubmit() {
    setError("");

    if (!name.trim()) {
      setError("Academic period name is required.");
      return;
    }

    if (!startDate || !endDate) {
      setError("Start date and end date are required.");
      return;
    }

    if (startDate >= endDate) {
      setError("End date must be after the start date.");
      return;
    }

    setIsSubmitting(true);

    try {
      const input = {
        name: name.trim(),
        type,
        startDate,
        endDate,
        academicYearId,
      };

      if (periodId) {
        await updateAcademicPeriod(
          academicYearId,
          periodId,
          input
        );
      } else {
        await createAcademicPeriod(input);
      }

      router.push(`/dashboard/academic-years/${academicYearId}`);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save academic period."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Box sx={{ maxWidth: 640 }}>
      <Stack spacing={3}>
        <TextField
          label="Period Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          fullWidth
          disabled={isSubmitting}
          placeholder="e.g. Term 1"
        />

        <FormControl fullWidth disabled={isSubmitting}>
          <InputLabel id="period-type-label">
            Type
          </InputLabel>

          <Select
            labelId="period-type-label"
            value={type}
            label="Type"
            onChange={(event) =>
              setType(event.target.value as PeriodType)
            }
          >
            <MenuItem value="TERM">Term</MenuItem>
            <MenuItem value="EXAM">Exam</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(event) =>
            setStartDate(event.target.value)
          }
          fullWidth
          disabled={isSubmitting}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />

        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(event) =>
            setEndDate(event.target.value)
          }
          fullWidth
          disabled={isSubmitting}
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />

        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}

        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "flex-end",
          }}
        >
          <Button
            variant="outlined"
            onClick={() =>
              router.push(
                `/dashboard/academic-years/${academicYearId}`
              )
            }
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : isEdit
                ? "Update Period"
                : "Create Period"}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}