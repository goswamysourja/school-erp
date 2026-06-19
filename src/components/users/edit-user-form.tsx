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

interface Tenant {
  id: string;
  name: string;
}

interface Props {
  id: string;
  initialName: string;
  initialRole: string;
  initialTenantId: string;
  tenants: Tenant[];
}

export function EditUserForm({
  id,
  initialName,
  initialRole,
  initialTenantId,
  tenants,
}: Props) {
  const [name, setName] =
    useState(initialName);

  const [role, setRole] =
    useState(initialRole);

  const [tenantId, setTenantId] =
    useState(initialTenantId);

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
          `/api/users/${id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              name,
              role,
              tenantId,
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
          : "Failed to update user"
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
            label="Full Name"
            fullWidth
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
          />

          <TextField
            select
            label="Role"
            fullWidth
            value={role}
            onChange={(e) =>
              setRole(
                e.target.value
              )
            }
          >
            <MenuItem value="ADMIN">
              ADMIN
            </MenuItem>

            <MenuItem value="TEACHER">
              TEACHER
            </MenuItem>

            <MenuItem value="STUDENT">
              STUDENT
            </MenuItem>
          </TextField>

          <TextField
            select
            label="Tenant"
            fullWidth
            value={tenantId}
            onChange={(e) =>
              setTenantId(
                e.target.value
              )
            }
          >
            {tenants.map(
              (tenant) => (
                <MenuItem
                  key={
                    tenant.id
                  }
                  value={
                    tenant.id
                  }
                >
                  {tenant.name}
                </MenuItem>
              )
            )}
          </TextField>

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
              disabled={
                loading
              }
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