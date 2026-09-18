"use client";

import { useState } from "react";

import {
  Alert,
  Button,
  Stack,
  TextField,
} from "@mui/material";

import { FormCard }
  from "@/components/ui/form-card";

export function CreateTenantForm() {
  const [name, setName] =
    useState("");

  const [slug, setSlug] =
    useState("");

  const [adminName, setAdminName] =
    useState("");

  const [adminPhone, setAdminPhone] =
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
          "/api/tenants",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              name,
              slug,
              adminName,
              adminPhone,
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
          : "Failed to create tenant"
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
            label="Tenant Name"
            fullWidth
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
          />

          <TextField
            label="Tenant Slug"
            fullWidth
            value={slug}
            onChange={(e) =>
              setSlug(
                e.target.value
              )
            }
          />

          <TextField
            label="Primary Admin Name"
            fullWidth
            value={adminName}
            onChange={(e) =>
              setAdminName(
                e.target.value
              )
            }
          />

          <TextField
            label="Primary Admin Phone"
            type="tel"
            fullWidth
            value={adminPhone}
            onChange={(e) =>
              setAdminPhone(
                e.target.value
              )
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
                ? "Creating..."
                : "Create Tenant"}
            </Button>
          </Stack>
        </Stack>
      </form>
    </FormCard>
  );
}