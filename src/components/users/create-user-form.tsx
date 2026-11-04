"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import type { CountryCode } from "libphonenumber-js";
import { StaffDesignation } from "@prisma/client";

import type { SvgIconProps } from "@mui/material/SvgIcon";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";

import { PhoneNumberInput } from "@/components/ui/phone-number-input";
import { toE164PhoneNumber } from "@/lib/phone";

function PersonAddAlt1Icon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </SvgIcon>
  );
}

function PersonIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </SvgIcon>
  );
}

function ArrowBackIcon() {
  return (
    <SvgIcon>
      <path
        d="M20 12H4m0 0 7-7m-7 7 7 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
}

export function CreateUserForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] =
    useState<CountryCode>("IN");

  const [designation, setDesignation] =
    useState<StaffDesignation | "">("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const internationalPhone = toE164PhoneNumber(
    phone,
    countryCode,
  );

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Please enter the staff member's name.");
      return;
    }

    if (!internationalPhone) {
      setError("Please enter a valid phone number.");
      return;
    }

    if (!designation) {
      setError("Please select a staff designation.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          phone: internationalPhone,
          designation,
        }),
      });

      const data = (await response.json().catch(() => null)) as {
        success?: boolean;
        error?: string;
        message?: string;
      } | null;

      if (!response.ok || data?.success !== true) {
        throw new Error(
          data?.message ??
            data?.error ??
            "Unable to create the staff member. Please try again.",
        );
      }

      router.push("/dashboard/users");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: 760,
        border: 1,
        borderColor: "divider",
        borderRadius: 3,
        overflow: "hidden",
        bgcolor: "background.paper",
      }}
    >
      <Box sx={{ p: { xs: 2.5, sm: 3.5 } }}>
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: "center" }}
        >
          <Avatar
            variant="rounded"
            sx={{
              width: 52,
              height: 52,
              bgcolor: "primary.main",
              color: "primary.contrastText",
              borderRadius: 2.5,
            }}
          >
            <PersonAddAlt1Icon fontSize="large" />
          </Avatar>

          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Staff information
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Enter the details to create a new staff account.
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Divider />

      <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={3}>
            {error && (
              <Alert
                severity="error"
                onClose={() => setError("")}
              >
                {error}
              </Alert>
            )}

            {/* Full Name */}
            <Box>
              <Typography
                component="label"
                htmlFor="staff-name"
                variant="body2"
                sx={{
                  display: "block",
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                Full name{" "}
                <Box
                  component="span"
                  sx={{ color: "error.main" }}
                >
                  *
                </Box>
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                }}
              >
                <Box sx={{ pl: 1.5, display: "flex" }}>
                  <PersonIcon color="action" />
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <input
                    id="staff-name"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    disabled={loading}
                    required
                    autoComplete="name"
                    placeholder="Enter the staff member's full name"
                    style={{
                      width: "100%",
                      border: 0,
                      outline: 0,
                      padding: "16px 12px",
                      background: "transparent",
                      font: "inherit",
                      color: "inherit",
                    }}
                  />
                </Box>
              </Box>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 0.75 }}
              >
                Use the name that should appear in school records.
              </Typography>
            </Box>

            {/* Phone Number */}
            <Box>
              <Typography
                variant="body2"
                sx={{
                  display: "block",
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                Phone number{" "}
                <Box
                  component="span"
                  sx={{ color: "error.main" }}
                >
                  *
                </Box>
              </Typography>

              <PhoneNumberInput
                id="staff-phone"
                countryCode={countryCode}
                onCountryChange={setCountryCode}
                phone={phone}
                onPhoneChange={setPhone}
                disabled={loading}
                label="Phone Number"
              />

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 0.75 }}
              >
                Select the staff member's country and enter their local phone number.
              </Typography>
            </Box>

            {/* Staff Designation */}
            <Box>
              <Typography
                variant="body2"
                sx={{
                  display: "block",
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                Staff designation{" "}
                <Box
                  component="span"
                  sx={{ color: "error.main" }}
                >
                  *
                </Box>
              </Typography>

              <FormControl
                fullWidth
                required
                disabled={loading}
              >
                <InputLabel id="staff-designation-label">
                  Select designation
                </InputLabel>

                <Select
                  labelId="staff-designation-label"
                  id="staff-designation"
                  value={designation}
                  label="Select designation"
                  onChange={(event) =>
                    setDesignation(
                      event.target.value as StaffDesignation | "",
                    )
                  }
                  sx={{
                    borderRadius: 2,
                  }}
                >
                  <MenuItem value="">
                    <em>Select designation</em>
                  </MenuItem>

                  <MenuItem value={StaffDesignation.TEACHER}>
                    Teacher
                  </MenuItem>

                  <MenuItem value={StaffDesignation.LIBRARIAN}>
                    Librarian
                  </MenuItem>

                  <MenuItem value={StaffDesignation.ACCOUNTANT}>
                    Accountant
                  </MenuItem>
                </Select>
              </FormControl>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 0.75 }}
              >
                Select the primary position of this staff member.
              </Typography>
            </Box>

            <Divider />

            {/* Actions */}
            <Stack
              direction={{ xs: "column-reverse", sm: "row" }}
              spacing={1.5}
              sx={{ justifyContent: "flex-end" }}
            >
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<ArrowBackIcon />}
                href="/dashboard/users"
                disabled={loading}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  minHeight: 44,
                }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                startIcon={
                  loading ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <PersonAddAlt1Icon />
                  )
                }
                disabled={
                  loading ||
                  !name.trim() ||
                  !internationalPhone ||
                  !designation
                }
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  minHeight: 44,
                  px: 3,
                  boxShadow: "none",
                }}
              >
                {loading ? "Creating staff..." : "Create staff"}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}