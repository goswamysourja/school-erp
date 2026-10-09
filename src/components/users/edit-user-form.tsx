"use client";

import {
  useState,
} from "react";

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
  initialPhone?: string;
}

export function EditUserForm({
  id,
  initialName,
  initialPhone = "",
}: Props) {
  const [name, setName] =
    useState(initialName);

  const [phone, setPhone] =
    useState(initialPhone);

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

      const response =
        await fetch(
          `/api/users/${id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              name,
              phone,
            }),
          },
        );

      const data =
        await response.json();

      if (!data.success) {
        throw new Error(
          data.message,
        );
      }

      window.location.href =
        "/dashboard/users";
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update user",
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
            label="Full Name"
            fullWidth
            value={name}
            onChange={(e) =>
              setName(
                e.target.value,
              )
            }
          />

          <TextField
            label="Phone"
            type="tel"
            fullWidth
            value={phone}
            onChange={(e) =>
              setPhone(
                e.target.value,
              )
            }
            helperText="This phone number is used for teacher login."
          />

          <Stack
            direction="row"
            spacing={2}
          >
            <Button
              variant="outlined"
              href="/dashboard/users"
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