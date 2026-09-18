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

import { createSubject }
  from "@/modules/subjects/api";

interface Props {}

export function CreateSubjectForm({}: Props) {
  const [name, setName] =
    useState("");

  const [code, setCode] =
    useState("");

  const [
    description,
    setDescription,
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

      await createSubject({
        name,
        code,
        description,
      });

      window.location.href =
        "/dashboard/subjects";
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create subject"
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
                ? "Creating..."
                : "Create Subject"}
            </Button>
          </Stack>
        </Stack>
      </form>
    </FormCard>
  );
}