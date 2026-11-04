"use client";

import { useState } from "react";

import {
  Box,
  Button,
  Card,
  Chip,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";

type StaffDesignation =
  | "TEACHER"
  | "LIBRARIAN"
  | "ACCOUNTANT";

type DesignationFilter = StaffDesignation | "ALL";

interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  designation: StaffDesignation | null;
  hasTeacherProfile: boolean;
  isActive: boolean;
  tenant?: {
    name: string;
  } | null;
}

interface UsersListClientProps {
  initialUsers: Staff[];
}

const designationLabels: Record<StaffDesignation, string> = {
  TEACHER: "Teacher",
  LIBRARIAN: "Librarian",
  ACCOUNTANT: "Accountant",
};

const designationColors: Record<
  StaffDesignation,
  "primary" | "info" | "warning"
> = {
  TEACHER: "primary",
  LIBRARIAN: "info",
  ACCOUNTANT: "warning",
};

export function UsersListClient({
  initialUsers,
}: UsersListClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const [designationFilter, setDesignationFilter] =
    useState<DesignationFilter>("ALL");

  const query = searchQuery.trim().toLowerCase();

  const filteredUsers = initialUsers.filter((user) => {
    const fullName =
      `${user.firstName} ${user.lastName}`.toLowerCase();

    const phone = user.phone.toLowerCase();

    const designation = user.designation
      ? designationLabels[user.designation].toLowerCase()
      : "unassigned";

    const matchesSearch =
      fullName.includes(query) ||
      phone.includes(query) ||
      designation.includes(query);

    const matchesDesignation =
      designationFilter === "ALL" ||
      user.designation === designationFilter;

    return matchesSearch && matchesDesignation;
  });

  return (
    <Card
      elevation={0}
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
        minWidth: 0,
      }}
    >
      {/* Search and filters */}
      <Box
        sx={{
          p: { xs: 2, sm: 2.5 },
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "minmax(0, 1fr) 220px",
            },
            gap: 2,
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Search by name, phone, or designation..."
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(event.target.value)
            }
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      fontSize="small"
                      color="action"
                    />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />

          <FormControl fullWidth size="small">
            <InputLabel id="designation-filter-label">
              Designation
            </InputLabel>

            <Select
              labelId="designation-filter-label"
              value={designationFilter}
              label="Designation"
              onChange={(event) =>
                setDesignationFilter(
                  event.target.value as DesignationFilter,
                )
              }
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="ALL">
                All Designations
              </MenuItem>

              <MenuItem value="TEACHER">
                Teacher
              </MenuItem>

              <MenuItem value="LIBRARIAN">
                Librarian
              </MenuItem>

              <MenuItem value="ACCOUNTANT">
                Accountant
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Staff table */}
      <TableContainer>
        <Table
          sx={{ minWidth: 850 }}
          aria-label="Staff list"
        >
          <TableHead>
            <TableRow
              sx={{
                bgcolor: "action.hover",
                "& th": {
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                  color: "text.secondary",
                },
              }}
            >
              <TableCell>Name</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Designation</TableCell>
              <TableCell>Academic Profile</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  align="center"
                  sx={{ py: 6 }}
                >
                  <SearchIcon
                    sx={{
                      fontSize: 36,
                      color: "text.disabled",
                      mb: 1,
                    }}
                  />

                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600 }}
                  >
                    No staff members found
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    Try another name, phone number, or designation.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow
                  key={user.id}
                  hover
                  sx={{
                    "&:last-child td": {
                      borderBottom: 0,
                    },
                  }}
                >
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 700 }}
                    >
                      {user.firstName} {user.lastName}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {user.tenant?.name ?? "No assigned school"}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">
                      {user.phone || "—"}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    {user.designation ? (
                      <Chip
                        label={designationLabels[user.designation]}
                        size="small"
                        color={designationColors[user.designation]}
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />
                    ) : (
                      <Chip
                        label="Unassigned"
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </TableCell>

                  <TableCell>
                    {user.designation === "TEACHER" ? (
                      <Chip
                        label={
                          user.hasTeacherProfile
                            ? "Linked"
                            : "Profile pending"
                        }
                        size="small"
                        color={
                          user.hasTeacherProfile
                            ? "success"
                            : "warning"
                        }
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />
                    ) : (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        —
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={user.isActive ? "Active" : "Inactive"}
                      size="small"
                      color={user.isActive ? "success" : "default"}
                      variant={user.isActive ? "filled" : "outlined"}
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>

                  <TableCell align="right">
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ justifyContent: "flex-end" }}
                    >
                      <Button
                        size="small"
                        variant="outlined"
                        href={`/dashboard/users/${user.id}/edit`}
                        startIcon={<EditIcon />}
                        sx={{
                          textTransform: "none",
                          borderRadius: 1.5,
                        }}
                      >
                        Edit
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}