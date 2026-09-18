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

import { FormCard }
  from "@/components/ui/form-card";

interface Props {
  id: string;
  initialName: string;
  initialSlug: string;
}

export function EditTenantForm({
  id,
  initialName,
  initialSlug,
}: Props) {
  const [name, setName] =
    useState(initialName);

  const [slug, setSlug] =
    useState(initialSlug);

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
          `/api/tenants/${id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              name,
              slug,
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
        "/dashboard/tenants";
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update tenant"
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
            label="Tenant Name"
            fullWidth
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          <TextField
            label="Tenant Slug"
            fullWidth
            value={slug}
            onChange={(e) =>
              setSlug(e.target.value)
            }
          />

          <Stack
            direction="row"
            spacing={2}
          >
            <Button
              variant="outlined"
              href="/dashboard/tenants"
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