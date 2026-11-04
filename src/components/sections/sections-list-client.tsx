
"use client";

import { useMemo, useState } from "react";

import {
  Box,
  Button,
  Card,
  Chip,
  InputAdornment,
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
import BlockIcon from "@mui/icons-material/Block";

interface SectionItem {
  id: string;
  name: string;
  isActive: boolean;
  class: {
    name: string;
    academicYearRecord?: {
      name: string;
    } | null;
    academicYear?: string | null;
  };
}

interface SectionsListClientProps {
  initialSections: SectionItem[];
}

export function SectionsListClient({
  initialSections,
}: SectionsListClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSections = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return initialSections;
    }

    return initialSections.filter((section) => {
      const sectionName = section.name.toLowerCase();
      const className = section.class.name.toLowerCase();

      const academicYear = (
        section.class.academicYearRecord?.name ??
        section.class.academicYear ??
        ""
      ).toLowerCase();

      return (
        sectionName.includes(query) ||
        className.includes(query) ||
        academicYear.includes(query)
      );
    });
  }, [initialSections, searchQuery]);

  return (
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
      {/* Search */}
      <Box
        sx={{
          p: { xs: 2, sm: 2.5 },
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Search by section, class, or academic year..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            maxWidth: 520,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />
      </Box>

      {/* Sections Table */}
      <TableContainer>
        <Table sx={{ minWidth: 760 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: "action.hover" }}>
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: "text.primary",
                  whiteSpace: "nowrap",
                }}
              >
                Section
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                  color: "text.primary",
                  whiteSpace: "nowrap",
                }}
              >
                Class
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                  color: "text.primary",
                  whiteSpace: "nowrap",
                }}
              >
                Academic Year
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                  color: "text.primary",
                  whiteSpace: "nowrap",
                }}
              >
                Status
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                  color: "text.primary",
                  whiteSpace: "nowrap",
                  textAlign: "right",
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredSections.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  sx={{
                    py: 6,
                    textAlign: "center",
                  }}
                >
                  <Stack
                    spacing={0.75}
                    sx={{
                      alignItems: "center",
                    }}
                  >
                    <SearchIcon
                      sx={{
                        fontSize: 36,
                        color: "text.disabled",
                      }}
                    />

                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 600 }}
                    >
                      No sections found
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {searchQuery.trim()
                        ? `No sections match "${searchQuery}".`
                        : "There are no sections available yet."}
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            ) : (
              filteredSections.map((section) => {
                const academicYear =
                  section.class.academicYearRecord?.name ??
                  section.class.academicYear ??
                  "N/A";

                return (
                  <TableRow
                    key={section.id}
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
                        sx={{
                          fontWeight: 700,
                          color: "primary.main",
                        }}
                      >
                        Section {section.name}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500 }}
                      >
                        {section.class.name}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {academicYear}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={section.isActive ? "Active" : "Inactive"}
                        size="small"
                        color={section.isActive ? "success" : "default"}
                        variant="outlined"
                        sx={{
                          fontWeight: 600,
                          borderRadius: 1.5,
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          justifyContent: "flex-end",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          href={`/dashboard/sections/${section.id}/edit`}
                          size="small"
                          variant="outlined"
                          aria-label={`Edit section ${section.name}`}
                          sx={{
                            minWidth: 38,
                            width: 38,
                            height: 36,
                            p: 0,
                            borderRadius: 1.5,
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </Button>

                        <Button
                          size="small"
                          variant={section.isActive ? "outlined" : "contained"}
                          color={section.isActive ? "error" : "success"}
                          aria-label={
                            section.isActive
                              ? `Deactivate section ${section.name}`
                              : `Activate section ${section.name}`
                          }
                          sx={{
                            minWidth: 38,
                            width: 38,
                            height: 36,
                            p: 0,
                            borderRadius: 1.5,
                          }}
                        >
                          <BlockIcon fontSize="small" />
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}
