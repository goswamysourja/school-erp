
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";

interface Props {
  id: string;
  initialName: string;
}

export function EditSectionForm({ id, initialName }: Props) {
  const router = useRouter();

  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Please enter a section name.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/sections/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
        }),
      });

      const data = (await response.json().catch(() => null)) as {
        success?: boolean;
        message?: string;
        error?: string;
      } | null;

      if (!response.ok || data?.success !== true) {
        throw new Error(
          data?.message ?? data?.error ?? "Failed to update section.",
        );
      }

      router.push("/dashboard/sections");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update section.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ width: "100%", maxWidth: 700 }}>
      <Card
        elevation={0}
        sx={{
          width: "100%",
          border: 1,
          borderColor: "divider",
          borderRadius: 3,
          overflow: "hidden",
          bgcolor: "background.paper",
        }}
      >
        <CardContent
          sx={{
            p: { xs: 2.5, sm: 3.5 },
            "&:last-child": {
              pb: { xs: 2.5, sm: 3.5 },
            },
          }}
        >
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={3}>
              {/* Header */}
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    letterSpacing: "-0.2px",
                  }}
                >
                  Update Section
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  Modify the identifier for this specific section.
                </Typography>
              </Box>

              {/* Error */}
              {error && (
                <Alert
                  severity="error"
                  onClose={() => setError("")}
                  sx={{ borderRadius: 2 }}
                >
                  {error}
                </Alert>
              )}

              {/* Form Field */}
              <TextField
                id="section-name"
                label="Section Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                fullWidth
                required
                disabled={loading}
                autoComplete="off"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />

              <Divider />

              {/* Actions */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: {
                    xs: "column-reverse",
                    sm: "row",
                  },
                  gap: 1.5,
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  href="/dashboard/sections"
                  variant="outlined"
                  color="inherit"
                  disabled={loading}
                  sx={{
                    minHeight: 44,
                    px: 3,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading || !name.trim()}
                  startIcon={<SaveIcon />}
                  sx={{
                    minHeight: 44,
                    px: 3,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    boxShadow: "none",
                    "&:hover": {
                      boxShadow: "none",
                    },
                  }}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </Box>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
