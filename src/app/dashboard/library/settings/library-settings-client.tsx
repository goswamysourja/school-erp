
"use client";

import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

interface LibrarySettingsResponse {
  maxBooksPerStudent: number;
  loanPeriodDays: number;
  renewalLimit: number;
  gracePeriodDays: number;
  finePerDay: string | number;
  lostBookCharge: string | number;
  damagedBookCharge: string | number;
}

interface SettingsForm {
  maxBooksPerStudent: string;
  loanPeriodDays: string;
  renewalLimit: string;
  gracePeriodDays: string;
  finePerDay: string;
  lostBookCharge: string;
  damagedBookCharge: string;
}

type SettingField = keyof SettingsForm;

const initialForm: SettingsForm = {
  maxBooksPerStudent: "3",
  loanPeriodDays: "14",
  renewalLimit: "1",
  gracePeriodDays: "0",
  finePerDay: "1.00",
  lostBookCharge: "0.00",
  damagedBookCharge: "0.00",
};

const numericFields: {
  name: SettingField;
  label: string;
  min: number;
  step: number;
  helperText: string;
}[] = [
  {
    name: "maxBooksPerStudent",
    label: "Maximum Books per Student",
    min: 1,
    step: 1,
    helperText: "Minimum 1 book per student.",
  },
  {
    name: "loanPeriodDays",
    label: "Loan Period (Days)",
    min: 1,
    step: 1,
    helperText: "Number of days before a book becomes overdue.",
  },
  {
    name: "renewalLimit",
    label: "Maximum Renewals",
    min: 0,
    step: 1,
    helperText: "Set to 0 to disable renewals.",
  },
  {
    name: "gracePeriodDays",
    label: "Grace Period (Days)",
    min: 0,
    step: 1,
    helperText: "Overdue days excluded from fine calculation.",
  },
  {
    name: "finePerDay",
    label: "Fine per Overdue Day (₹)",
    min: 0,
    step: 0.01,
    helperText: "Fine charged for each fineable overdue day.",
  },
  {
    name: "lostBookCharge",
    label: "Lost Book Charge (₹)",
    min: 0,
    step: 0.01,
    helperText: "Default charge for a lost book.",
  },
  {
    name: "damagedBookCharge",
    label: "Damaged Book Charge (₹)",
    min: 0,
    step: 0.01,
    helperText: "Default charge for a damaged book.",
  },
];

async function readError(
  response: Response,
  fallback: string,
): Promise<string> {
  const result = (await response.json().catch(() => null)) as {
    error?: string;
  } | null;

  return result?.error ?? fallback;
}

function toFormValues(
  settings: LibrarySettingsResponse,
): SettingsForm {
  return {
    maxBooksPerStudent: String(settings.maxBooksPerStudent),
    loanPeriodDays: String(settings.loanPeriodDays),
    renewalLimit: String(settings.renewalLimit),
    gracePeriodDays: String(settings.gracePeriodDays),
    finePerDay: String(settings.finePerDay),
    lostBookCharge: String(settings.lostBookCharge),
    damagedBookCharge: String(settings.damagedBookCharge),
  };
}

export function LibrarySettingsClient() {
  const [form, setForm] = useState<SettingsForm>(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadSettings() {
      try {
        setError("");

        const response = await fetch("/api/library/settings", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            await readError(response, "Failed to load library settings."),
          );
        }

        const settings =
          (await response.json()) as LibrarySettingsResponse;

        setForm(toFormValues(settings));
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load library settings.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadSettings();

    return () => controller.abort();
  }, []);

  function updateField(name: SettingField, value: string) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  async function handleSave() {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload: Record<string, number> = {};

      for (const field of numericFields) {
        const value = form[field.name].trim();
        const numberValue = Number(value);

        if (
          value === "" ||
          !Number.isFinite(numberValue) ||
          numberValue < field.min
        ) {
          throw new Error(
            `${field.label} must be at least ${field.min}.`,
          );
        }

        if (
          field.step === 1 &&
          !Number.isInteger(numberValue)
        ) {
          throw new Error(`${field.label} must be a whole number.`);
        }

        if (
          field.step === 0.01 &&
          Math.abs(numberValue * 100 - Math.round(numberValue * 100)) >
            1e-7
        ) {
          throw new Error(
            `${field.label} must have at most two decimal places.`,
          );
        }

        payload[field.name] = numberValue;
      }

      const response = await fetch("/api/library/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(
          await readError(response, "Failed to update library settings."),
        );
      }

      const updated =
        (await response.json()) as LibrarySettingsResponse;

      setForm(toFormValues(updated));
      setSuccess("Library settings saved successfully.");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to save library settings.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Library Settings
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Configure borrowing limits, loan periods, renewal rules, and
        library charges for your institution.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 6,
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Borrowing Rules
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
              },
              gap: 3,
            }}
          >
            {numericFields.map((field) => (
              <TextField
                key={field.name}
                label={field.label}
                type="number"
                value={form[field.name]}
                onChange={(event) =>
                  updateField(field.name, event.target.value)
                }
                helperText={field.helperText}
                slotProps={{
                  htmlInput: {
                    min: field.min,
                    step: field.step,
                  },
                }}
                fullWidth
              />
            ))}
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1.5,
              mt: 4,
            }}
          >
            <Button
              variant="contained"
              onClick={() => void handleSave()}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Settings"}
            </Button>

            <Button
              variant="outlined"
              disabled={saving}
              onClick={() => {
                setError("");
                setSuccess("");
                setForm(initialForm);
              }}
            >
              Reset Form
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
}
