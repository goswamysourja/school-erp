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

interface Teacher {
  id: string;
  name: string;
}

interface Props {
  tenants: Tenant[];
  teachers: Teacher[];
}

export function CreateClassForm({
  tenants,
  teachers,
}: Props) {
  const [name, setName] =
    useState("");

  const [section, setSection] =
    useState("");

  const [
    academicYear,
    setAcademicYear,
  ] = useState("");

  const [tenantId, setTenantId] =
    useState("");

  const [
    classTeacherId,
    setClassTeacherId,
  ] = useState("");

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
          "/api/classes",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              name,
              section,
              academicYear,
              tenantId,
              classTeacherId:
                classTeacherId ||
                undefined,
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
        "/dashboard/classes";
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create class"
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
            label="Class Name"
            fullWidth
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
          />

          <TextField
            label="Section"
            fullWidth
            value={section}
            onChange={(e) =>
              setSection(
                e.target.value
              )
            }
          />

          <TextField
            label="Academic Year"
            fullWidth
            value={academicYear}
            onChange={(e) =>
              setAcademicYear(
                e.target.value
              )
            }
          />

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

          <TextField
            select
            label="Class Teacher"
            fullWidth
            value={classTeacherId}
            onChange={(e) =>
              setClassTeacherId(
                e.target.value
              )
            }
          >
            <MenuItem value="">
              No Teacher
            </MenuItem>

            {teachers.map(
              (teacher) => (
                <MenuItem
                  key={
                    teacher.id
                  }
                  value={
                    teacher.id
                  }
                >
                  {teacher.name}
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
              href="/dashboard/classes"
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
                : "Create Class"}
            </Button>
          </Stack>
        </Stack>
      </form>
    </FormCard>
  );
}