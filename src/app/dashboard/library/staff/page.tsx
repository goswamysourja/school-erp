"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";

interface StaffUser {
  id: string;
  name: string;
  phone: string;
  role: string;
  isActive: boolean;
}

interface LibraryStaffAssignment {
  id: string;
  userId: string;
  tenantId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    phone: string;
    role: string;
    isActive: boolean;
  };
}

interface UsersResponse {
  success?: boolean;
  users?: StaffUser[];
  message?: string;
  error?: string;
}

async function getErrorMessage(
  response: Response,
  fallback: string,
): Promise<string> {
  const data = (await response.json().catch(() => null)) as {
    error?: string;
    message?: string;
  } | null;

  return data?.error ?? data?.message ?? fallback;
}

export default function LibraryStaffPage() {
  const [staff, setStaff] = useState<LibraryStaffAssignment[]>([]);
  const [availableStaff, setAvailableStaff] = useState<StaffUser[]>([]);

  const [userId, setUserId] = useState("");
  const [search, setSearch] = useState("");
  const [activeOnly, setActiveOnly] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyUserId, setBusyUserId] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadStaff() {
    const params = new URLSearchParams();

    if (activeOnly) {
      params.set("activeOnly", "true");
    }

    const response = await fetch(
      `/api/library/staff?${params.toString()}`,
      { cache: "no-store" },
    );

    if (!response.ok) {
      throw new Error(
        await getErrorMessage(
          response,
          "Failed to load library staff.",
        ),
      );
    }

    const data =
      (await response.json()) as LibraryStaffAssignment[];

    setStaff(data);
  }

  async function loadAvailableStaff() {
    const response = await fetch("/api/users", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        await getErrorMessage(
          response,
          "Failed to load staff members.",
        ),
      );
    }

    const data = (await response.json()) as UsersResponse;

    if (!data.success || !data.users) {
      throw new Error(
        data.message ?? data.error ?? "Failed to load staff members.",
      );
    }

    setAvailableStaff(data.users);
  }

  async function loadData() {
    await Promise.all([
      loadStaff(),
      loadAvailableStaff(),
    ]);
  }

  useEffect(() => {
    async function initialize() {
      try {
        setError("");
        await loadData();
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load library staff.",
        );
      } finally {
        setLoading(false);
      }
    }

    void initialize();
  }, [activeOnly]);

  async function handleAssign(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const normalizedUserId = userId.trim();

      if (!normalizedUserId) {
        throw new Error("Please select a staff member.");
      }

      const response = await fetch("/api/library/staff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: normalizedUserId,
        }),
      });

      if (!response.ok) {
        throw new Error(
          await getErrorMessage(
            response,
            "Failed to assign library staff.",
          ),
        );
      }

      const selectedStaff = availableStaff.find(
        (person) => person.id === normalizedUserId,
      );

      setUserId("");

      setSuccess(
        `Library responsibility assigned to ${
          selectedStaff?.name ?? "the selected staff member"
        } successfully. Existing inactive assignments are reactivated.`,
      );

      await loadStaff();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to assign library staff.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDeactivate(
    assignment: LibraryStaffAssignment,
  ) {
    const userName = assignment.user.name;

    const confirmed = window.confirm(
      `Deactivate library access for ${userName}? Their staff account and other responsibilities will remain unchanged.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setBusyUserId(assignment.userId);
      setError("");
      setSuccess("");

      const response = await fetch(
        `/api/library/staff/${encodeURIComponent(assignment.userId)}`,
        { method: "DELETE" },
      );

      if (!response.ok) {
        throw new Error(
          await getErrorMessage(
            response,
            "Failed to deactivate library staff.",
          ),
        );
      }

      setSuccess(
        `Library access for ${userName} was deactivated. Other responsibilities remain unchanged.`,
      );

      await loadStaff();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to deactivate library staff.",
      );
    } finally {
      setBusyUserId("");
    }
  }

  const filteredStaff = staff.filter((assignment) => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return true;
    }

    const user = assignment.user;

    return (
      user.name.toLowerCase().includes(query) ||
      user.phone.toLowerCase().includes(query) ||
      user.id.toLowerCase().includes(query)
    );
  });

  const activeStaffOptions = availableStaff.filter(
    (person) => person.isActive,
  );

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 1 }}>
        Library Staff
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Assign existing staff members to manage library operations.
        Library access is managed independently of their other responsibilities.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {/* Assign Library Staff */}
      <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Assign Staff Member
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          Select an active staff member. This assignment grants
          library access without changing their other responsibilities.
        </Typography>

        <Box
          component="form"
          onSubmit={handleAssign}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "stretch", sm: "flex-start" },
            gap: 2,
          }}
        >
          <FormControl
            fullWidth
            required
            sx={{ maxWidth: { sm: 500 } }}
          >
            <InputLabel id="library-staff-select-label">
              Select Staff Member
            </InputLabel>

            <Select
              labelId="library-staff-select-label"
              id="library-staff-select"
              value={userId}
              label="Select Staff Member"
              onChange={(event) => setUserId(event.target.value)}
              disabled={saving}
            >
              {activeStaffOptions.length === 0 ? (
                <MenuItem disabled value="">
                  No active staff members available
                </MenuItem>
              ) : (
                activeStaffOptions.map((person) => {
                  const existingAssignment = staff.find(
                    (assignment) =>
                      assignment.userId === person.id &&
                      assignment.isActive,
                  );

                  return (
                    <MenuItem
                      key={person.id}
                      value={person.id}
                    >
                      {person.name} — {person.phone}
                      {existingAssignment
                        ? " (Already assigned)"
                        : ""}
                    </MenuItem>
                  );
                })
              )}
            </Select>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            disabled={saving || !userId}
            sx={{ minHeight: 56, flexShrink: 0 }}
          >
            {saving ? "Assigning..." : "Assign Library Staff"}
          </Button>
        </Box>
      </Paper>

      {/* Staff List Controls */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
          mb: 2,
        }}
      >
        <Typography variant="h6">
          Staff Assignments ({filteredStaff.length})
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          <TextField
            size="small"
            label="Search staff"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            sx={{ width: { xs: "100%", sm: 260 } }}
          />

          <Button
            variant={activeOnly ? "contained" : "outlined"}
            onClick={() => setActiveOnly((current) => !current)}
          >
            {activeOnly ? "Showing Active" : "Show Active Only"}
          </Button>
        </Box>
      </Box>

      {/* Staff Assignments */}
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 5,
          }}
        >
          <CircularProgress />
        </Box>
      ) : filteredStaff.length === 0 ? (
        <Alert severity="info">
          No library staff assignments found. Assign a staff member
          or change your search/filter.
        </Alert>
      ) : (
        <Box sx={{ display: "grid", gap: 2 }}>
          {filteredStaff.map((assignment) => {
            const user = assignment.user;

            return (
              <Paper
                key={assignment.id}
                variant="outlined"
                sx={{ p: 2.5 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                    alignItems: { xs: "stretch", sm: "center" },
                    gap: 2,
                  }}
                >
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <Typography variant="h6">
                        {user.name}
                      </Typography>

                      <Chip
                        size="small"
                        label={
                          assignment.isActive
                            ? "Library Access Active"
                            : "Library Access Inactive"
                        }
                        color={
                          assignment.isActive
                            ? "success"
                            : "default"
                        }
                        variant="outlined"
                      />

                      {!user.isActive && (
                        <Chip
                          size="small"
                          label="Staff Account Inactive"
                          color="warning"
                          variant="outlined"
                        />
                      )}
                    </Box>

                    <Typography variant="body2">
                      Phone: {user.phone}
                    </Typography>

                    <Typography variant="body2">
                      User ID: {user.id}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      Assigned:{" "}
                      {new Date(
                        assignment.createdAt,
                      ).toLocaleDateString("en-IN")}
                    </Typography>
                  </Box>

                  {assignment.isActive && (
                    <Button
                      color="error"
                      variant="outlined"
                      disabled={busyUserId === assignment.userId}
                      onClick={() => void handleDeactivate(assignment)}
                    >
                      {busyUserId === assignment.userId
                        ? "Deactivating..."
                        : "Deactivate Access"}
                    </Button>
                  )}
                </Box>
              </Paper>
            );
          })}
        </Box>
      )}
    </Box>
  );
}