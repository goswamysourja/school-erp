"use client";

import { useEffect } from "react";

import {
  Box,
  Grid,
  Button,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import {
  Controller,
  useForm,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { FormCard } from "@/components/ui/form-card";

import {
  teacherFormSchema,
  updateTeacherSchema,
} from "../validators";

import type {
  TeacherFormValues,
} from "../types";

interface TeacherFormProps {
  mode: "create" | "edit";

  initialValues?: Partial<TeacherFormValues>;

  userName?: string;

  userPhone?: string;

  loading?: boolean;

  onSubmit: (
    values: TeacherFormValues,
  ) => void;

  onCancel?: () => void;
}

function getNameParts(
  fullName: string,
) {
  const parts =
    fullName.trim().split(/\s+/);

  return {
    firstName:
      parts[0] ?? "",

    lastName:
      parts.slice(1).join(" "),
  };
}

export function TeacherForm({
  mode,
  initialValues,
  userName = "",
  userPhone = "",
  loading = false,
  onSubmit,
  onCancel,
}: TeacherFormProps) {
  const isCreateMode =
    mode === "create";

  const identity =
    isCreateMode
      ? getNameParts(userName)
      : {
          firstName: "",
          lastName: "",
        };

  const {
    control,
    handleSubmit,
    reset,
    formState: {
      errors,
    },
  } = useForm<TeacherFormValues>({
    resolver: zodResolver(
      isCreateMode
        ? teacherFormSchema
        : updateTeacherSchema,
    ),

    mode: "onBlur",

    reValidateMode: "onChange",

    defaultValues: {
      employeeId: "",

      firstName:
        isCreateMode
          ? identity.firstName
          : "",

      lastName:
        isCreateMode
          ? identity.lastName
          : "",

      gender: "MALE",

      dateOfBirth: "",

      phone:
        isCreateMode
          ? userPhone
          : "",

      address: "",

      highestQualification: "",

      joiningDate: "",

      ...initialValues,
    },
  });

  useEffect(() => {
    reset({
      employeeId: "",

      firstName:
        isCreateMode
          ? identity.firstName
          : "",

      lastName:
        isCreateMode
          ? identity.lastName
          : "",

      gender: "MALE",

      dateOfBirth: "",

      phone:
        isCreateMode
          ? userPhone
          : "",

      address: "",

      highestQualification: "",

      joiningDate: "",

      ...initialValues,
    });
  }, [
    isCreateMode,
    identity.firstName,
    identity.lastName,
    userPhone,
    initialValues,
    reset,
  ]);

  return (
    <FormCard>
      <Box
        component="form"
        onSubmit={handleSubmit(
          (values) => {
            onSubmit(values);
          },
          (formErrors) => {
            console.error(
              "Teacher form validation failed:",
              formErrors,
            );
          },
        )}
      >
        {isCreateMode && (
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 1,
              }}
            >
              Existing User
            </Typography>

            <Grid
              container
              spacing={3}
            >
              <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}
              >
                <TextField
                  fullWidth
                  label="Full Name"
                  value={userName}
                  disabled
                />
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}
              >
                <TextField
                  fullWidth
                  label="Login Phone"
                  value={userPhone}
                  disabled
                />
              </Grid>
            </Grid>
          </Box>
        )}

        <Grid
          container
          spacing={3}
        >
          {/* Employee ID */}
          <Grid size={{ xs: 12 }}>
            <Controller
              control={control}
              name="employeeId"
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Employee ID"
                  placeholder="e.g. EMP001"
                  disabled={loading}
                  error={
                    !!errors.employeeId
                  }
                  helperText={
                    errors.employeeId?.message
                  }
                />
              )}
            />
          </Grid>

          {/* First Name */}
          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <Controller
              control={control}
              name="firstName"
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="First Name"
                  disabled={loading}
                  error={
                    !!errors.firstName
                  }
                  helperText={
                    errors.firstName?.message
                  }
                />
              )}
            />
          </Grid>

          {/* Last Name */}
          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <Controller
              control={control}
              name="lastName"
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Last Name"
                  disabled={loading}
                  error={
                    !!errors.lastName
                  }
                  helperText={
                    errors.lastName?.message
                  }
                />
              )}
            />
          </Grid>

          {/* Gender */}
          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <Controller
              control={control}
              name="gender"
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  fullWidth
                  label="Gender"
                  disabled={loading}
                  error={
                    !!errors.gender
                  }
                  helperText={
                    errors.gender?.message
                  }
                >
                  <MenuItem value="MALE">
                    Male
                  </MenuItem>

                  <MenuItem value="FEMALE">
                    Female
                  </MenuItem>

                  <MenuItem value="OTHER">
                    Other
                  </MenuItem>
                </TextField>
              )}
            />
          </Grid>

          {/* Phone */}
          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <Controller
              control={control}
              name="phone"
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Phone"
                  placeholder="Phone number"
                  disabled={loading}
                  error={
                    !!errors.phone
                  }
                  helperText={
                    errors.phone?.message ??
                    "Managed from the User profile."
                  }
                  slotProps={{
                    input: {
                      readOnly: true,
                    },
                  }}
                />
              )}
            />
          </Grid>

          {/* Date of Birth */}
          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <Controller
              control={control}
              name="dateOfBirth"
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Date of Birth"
                  type="date"
                  disabled={loading}
                  error={
                    !!errors.dateOfBirth
                  }
                  helperText={
                    errors.dateOfBirth?.message
                  }
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />
              )}
            />
          </Grid>

          {/* Joining Date */}
          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <Controller
              control={control}
              name="joiningDate"
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Joining Date"
                  type="date"
                  disabled={loading}
                  error={
                    !!errors.joiningDate
                  }
                  helperText={
                    errors.joiningDate?.message
                  }
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                />
              )}
            />
          </Grid>

          {/* Highest Qualification */}
          <Grid size={{ xs: 12 }}>
            <Controller
              control={control}
              name="highestQualification"
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Highest Qualification"
                  placeholder="e.g. M.Tech, B.Ed, Ph.D"
                  disabled={loading}
                  error={
                    !!errors.highestQualification
                  }
                  helperText={
                    errors.highestQualification?.message
                  }
                />
              )}
            />
          </Grid>

          {/* Address */}
          <Grid size={{ xs: 12 }}>
            <Controller
              control={control}
              name="address"
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  minRows={3}
                  label="Address"
                  placeholder="Enter complete address"
                  disabled={loading}
                  error={
                    !!errors.address
                  }
                  helperText={
                    errors.address?.message
                  }
                />
              )}
            />
          </Grid>
        </Grid>

        <Box
          sx={{
            mt: 5,
            display: "flex",
            justifyContent:
              "flex-end",
            gap: 2,
          }}
        >
          <Button
            variant="outlined"
            disabled={loading}
            onClick={onCancel}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            loading={loading}
          >
            {isCreateMode
              ? "Complete Profile"
              : "Save Changes"}
          </Button>
        </Box>
      </Box>
    </FormCard>
  );
}