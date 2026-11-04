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
  initialPhone?: string;
}

export function EditUserForm({
  id,
  initialName,
  initialPhone = "",
}: Props) {
  const router = useRouter();

  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName) {
      setError("Please enter the teacher's name.");
      return;
    }

    if (!trimmedPhone) {
      setError("Please enter the teacher's phone number.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          phone: trimmedPhone,
        }),
      });

      const data = (await response.json().catch(() => null)) as {
        success?: boolean;
        message?: string;
        error?: string;
      } | null;

      if (!response.ok || data?.success !== true) {
        throw new Error(
          data?.message ??
            data?.error ??
            "Failed to update user details.",
        );
      }

      router.push("/dashboard/users");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while updating the user.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 760,
      }}
    >
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
            p: {
              xs: 2.5,
              sm: 3.5,
            },
            "&:last-child": {
              pb: {
                xs: 2.5,
                sm: 3.5,
              },
            },
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
          >
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
                  User Details
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 0.5,
                  }}
                >
                  Update the teacher&apos;s personal and contact
                  information.
                </Typography>
              </Box>

              {/* Error */}
              {error && (
                <Alert
                  severity="error"
                  onClose={() => setError("")}
                  sx={{
                    borderRadius: 2,
                  }}
                >
                  {error}
                </Alert>
              )}

              {/* Fields */}
              <Stack spacing={2.5}>
                <TextField
                  id="edit-user-name"
                  label="Full Name"
                  fullWidth
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  autoComplete="name"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />

                <TextField
                  id="edit-user-phone"
                  label="Phone Number"
                  type="tel"
                  fullWidth
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={loading}
                  autoComplete="tel"
                  helperText="This phone number is used for teacher login."
                  slotProps={{
                    htmlInput: {
                      inputMode: "tel",
                      maxLength: 15,
                    },
                  }}
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
                  justifyContent: {
                    xs: "stretch",
                    sm: "flex-end",
                  },
                }}
              >
                <Button
                  href="/dashboard/users"
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
                    !name.trim() ||
                    !phone.trim()
                  }
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