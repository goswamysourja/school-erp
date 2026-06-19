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
  tenants: Tenant[];
}

export function CreateUserForm({
  tenants,
}: Props) {
  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [role, setRole] =
    useState("TEACHER");

  const [tenantId, setTenantId] =
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
              email,
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
          : "Failed to create user"
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
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) =>
              setEmail(
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
                ? "Creating..."
                : "Create User"}
            </Button>
          </Stack>
        </Stack>
      </form>
    </FormCard>
  );
}