"use client";

import { useMemo, useState } from "react";

import {
  Alert,
  Button,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";

import { FormCard }
  from "@/components/ui/form-card";

import { updateSubject }
  from "@/modules/subjects/api";

interface Tenant {
  id: string;
  name: string;
}

interface Class {
  id: string;
  name: string;
  section: string;
  academicYear: string;
  tenantId: string;
}

interface Props {
  id: string;

  initialName: string;

  initialCode: string;

  initialDescription: string;

  initialTenantId: string;

  initialClassId: string;

  tenants: Tenant[];

  classes: Class[];
}

export function EditSubjectForm({
  id,

  initialName,

  initialCode,

  initialDescription,

  initialTenantId,

  initialClassId,

  tenants,

  classes,
}: Props) {
  const [name, setName] =
    useState(initialName);

  const [code, setCode] =
    useState(initialCode);

  const [
    description,
    setDescription,
  ] = useState(
    initialDescription
  );

  const [tenantId, setTenantId] =
    useState(
      initialTenantId
    );

  const [classId, setClassId] =
    useState(
      initialClassId
    );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const filteredClasses =
    useMemo(
      () =>
        classes.filter(
          (classItem) =>
            classItem.tenantId ===
            tenantId
        ),
      [classes, tenantId]
    );

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      setError("");

      await updateSubject({
        id,

        name,

        code,

        description,

        tenantId,

        classId,
      });

      window.location.href =
        "/dashboard/subjects";
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update subject"
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
            select
            label="Tenant"
            fullWidth
            required
            value={tenantId}
            onChange={(e) => {
              setTenantId(
                e.target.value
              );

              setClassId("");
            }}
          >
            {tenants.map(
              (tenant) => (
                <MenuItem
                  key={tenant.id}
                  value={tenant.id}
                >
                  {tenant.name}
                </MenuItem>
              )
            )}
          </TextField>

          <TextField
            select
            label="Class"
            fullWidth
            required
            disabled={!tenantId}
            value={classId}
            onChange={(e) =>
              setClassId(
                e.target.value
              )
            }
          >
            <MenuItem
              value=""
              disabled
            >
              Select Class
            </MenuItem>

            {filteredClasses.map(
              (classItem) => (
                <MenuItem
                  key={classItem.id}
                  value={classItem.id}
                >
                  {classItem.name}
                  {" - "}
                  {classItem.section}
                  {" ("}
                  {
                    classItem.academicYear
                  }
                  {")"}
                </MenuItem>
              )
            )}
          </TextField>

          <TextField
            label="Subject Name"
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
            label="Subject Code"
            fullWidth
            required
            value={code}
            onChange={(e) =>
              setCode(
                e.target.value
              )
            }
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            minRows={3}
            value={description}
            onChange={(e) =>
              setDescription(
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
              onClick={() =>
                window.history.back()
              }
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