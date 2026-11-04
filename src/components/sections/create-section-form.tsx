
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
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

interface ClassOption {
  id: string;
  name: string;
}

interface Props {
  classes: ClassOption[];
  initialClassId?: string;
}

export function CreateSectionForm({
  classes,
  initialClassId,
}: Props) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [classId, setClassId] = useState(initialClassId ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cancelHref = initialClassId
    ? `/dashboard/sections?classId=${encodeURIComponent(initialClassId)}`
    : "/dashboard/sections";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!classId) {
      setError("Please select a class.");
      return;
    }

    if (!trimmedName) {
      setError("Please enter a section name.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/sections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          classId,
        }),
      });

      const data = (await response.json().catch(() => null)) as {
        success?: boolean;
        message?: string;
        error?: string;
      } | null;

      if (!response.ok || data?.success !== true) {
        throw new Error(
          data?.message ?? data?.error ?? "Failed to create section.",
        );
      }

      router.push(
        `/dashboard/sections?classId=${encodeURIComponent(classId)}`,
      );
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create section.",
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
                  Section Details
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  Assign a section name and link it to a specific class.
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

              {/* Form Fields */}
              <Stack spacing={2.5}>
                <FormControl
                  fullWidth
                  required
                  disabled={loading || classes.length === 0}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                >
                  <InputLabel id="class-select-label">
                    Class
                  </InputLabel>

                  <Select
                    labelId="class-select-label"
                    id="class-select"
                    value={classId}
                    label="Class"
                    onChange={(event) => setClassId(event.target.value)}
                  >
                    {classes.map((classItem) => (
                      <MenuItem
                        key={classItem.id}
                        value={classItem.id}
                      >
                        {classItem.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {classes.length === 0 && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    No classes are available. Create a class before
                    adding a section.
                  </Typography>
                )}

                <TextField
                  id="section-name"
                  label="Section Name"
                  fullWidth
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  disabled={loading}
                  placeholder="e.g. A, B, North"
                  autoComplete="off"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Stack>

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
                  href={cancelHref}
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
                  disabled={
                    loading ||
                    classes.length === 0 ||
                    !classId ||
                    !name.trim()
                  }
                  startIcon={<AddIcon />}
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
                  {loading ? "Creating..." : "Create Section"}
                </Button>
              </Box>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
