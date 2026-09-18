"use client";

import { useState } from "react";

import {
  Alert,
  Button,
  Stack,
  TextField,
} from "@mui/material";

import { FormCard } from "@/components/ui/form-card";

export function CreateUserForm() {
  const [name, setName] =
    useState("");

  const [phone, setPhone] =
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
          "/api/users",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              name,
              phone,
              role: "TEACHER",
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
        "/dashboard/users";
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create user"
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
            required
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
          />

          <TextField
            label="Phone Number"
            type="tel"
            fullWidth
            required
            value={phone}
            onChange={(e) =>
              setPhone(
                e.target.value
              )
            }
            placeholder="9674567809"
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
                ? "Creating..."
                : "Create User"}
            </Button>
          </Stack>
        </Stack>
      </form>
    </FormCard>
  );
}