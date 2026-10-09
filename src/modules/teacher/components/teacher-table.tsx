import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import SyncAltIcon from "@mui/icons-material/SyncAlt";

import { StatusChip } from "@/components/ui/status-chip";

import type {
  TeacherResponse,
} from "../types";

interface Props {
  teachers: TeacherResponse[];

  onEdit: (
    teacherId: string,
  ) => void;

  onToggleStatus: (
    teacherId: string,
  ) => void;
}

function getInitials(
  fullName: string,
) {
  return fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(
      (part) =>
        part[0]?.toUpperCase() ?? "",
    )
    .join("");
}

export function TeacherTable({
  teachers,
  onEdit,
  onToggleStatus,
}: Props) {
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        overflow: "hidden",
        bgcolor: "background.paper",
        boxShadow:
          "0 2px 10px rgba(0, 0, 0, 0.04)",
      }}
    >
      <Table>
        <TableHead>
          <TableRow
            sx={{
              bgcolor: "grey.50",
            }}
          >
            <TableCell
              sx={{
                py: 1.75,
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "text.secondary",
                textTransform:
                  "uppercase",
                letterSpacing:
                  "0.04em",
                borderBottom:
                  "1px solid",
                borderColor:
                  "divider",
              }}
            >
              Employee ID
            </TableCell>

            <TableCell
              sx={{
                py: 1.75,
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "text.secondary",
                textTransform:
                  "uppercase",
                letterSpacing:
                  "0.04em",
                borderBottom:
                  "1px solid",
                borderColor:
                  "divider",
              }}
            >
              Teacher
            </TableCell>

            <TableCell
              sx={{
                py: 1.75,
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "text.secondary",
                textTransform:
                  "uppercase",
                letterSpacing:
                  "0.04em",
                borderBottom:
                  "1px solid",
                borderColor:
                  "divider",
              }}
            >
              Phone
            </TableCell>

            <TableCell
              sx={{
                py: 1.75,
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "text.secondary",
                textTransform:
                  "uppercase",
                letterSpacing:
                  "0.04em",
                borderBottom:
                  "1px solid",
                borderColor:
                  "divider",
              }}
            >
              Status
            </TableCell>

            <TableCell
              align="right"
              sx={{
                py: 1.75,
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "text.secondary",
                textTransform:
                  "uppercase",
                letterSpacing:
                  "0.04em",
                borderBottom:
                  "1px solid",
                borderColor:
                  "divider",
              }}
            >
              Actions
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {teachers.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                sx={{
                  borderBottom: 0,
                }}
              >
                <Box
                  sx={{
                    py: 7,
                    textAlign:
                      "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color:
                        "text.primary",
                    }}
                  >
                    No teachers found
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mt: 0.5,
                    }}
                  >
                    No teacher
                    profiles are
                    available.
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            teachers.map(
              (teacher) => (
                <TableRow
                  key={teacher.id}
                  hover
                  sx={{
                    "&:last-child td": {
                      borderBottom: 0,
                    },
                    "&:hover": {
                      bgcolor:
                        "action.hover",
                    },
                  }}
                >
                  <TableCell
                    sx={{
                      py: 2,
                    }}
                  >
                    <Chip
                      label={
                        teacher.employeeId
                      }
                      size="small"
                      variant="outlined"
                      sx={{
                        fontWeight: 700,
                        fontSize:
                          "0.75rem",
                        borderRadius: 1.5,
                      }}
                    />
                  </TableCell>

                  <TableCell
                    sx={{
                      py: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems:
                          "center",
                        gap: 1.5,
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 38,
                          height: 38,
                          fontSize:
                            "0.8rem",
                          fontWeight: 700,
                          bgcolor:
                            "primary.main",
                        }}
                      >
                        {getInitials(
                          teacher.fullName,
                        )}
                      </Avatar>

                      <Box
                        sx={{
                          minWidth: 0,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 700,
                            lineHeight:
                              1.25,
                          }}
                        >
                          {
                            teacher.fullName
                          }
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display:
                              "block",
                            mt: 0.35,
                            textTransform:
                              "capitalize",
                          }}
                        >
                          {teacher.gender.toLowerCase()}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell
                    sx={{
                      py: 2,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        color:
                          teacher.userPhone
                            ? "text.primary"
                            : "text.secondary",
                      }}
                    >
                      {teacher.userPhone ||
                        "—"}
                    </Typography>
                  </TableCell>

                  <TableCell
                    sx={{
                      py: 2,
                    }}
                  >
                    <StatusChip
                      active={
                        teacher.isActive
                      }
                    />
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={{
                      py: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection:
                          "row",
                        gap: 0.5,
                        justifyContent:
                          "flex-end",
                      }}
                    >
                      <Tooltip
                        title="Edit teacher"
                        arrow
                      >
                        <IconButton
                          size="small"
                          onClick={() =>
                            onEdit(
                              teacher.id,
                            )
                          }
                          sx={{
                            width: 34,
                            height: 34,
                            border:
                              "1px solid",
                            borderColor:
                              "divider",
                            borderRadius:
                              1.5,
                            "&:hover": {
                              borderColor:
                                "primary.main",
                              bgcolor:
                                "primary.50",
                              color:
                                "primary.main",
                            },
                          }}
                        >
                          <EditIcon
                            fontSize="small"
                          />
                        </IconButton>
                      </Tooltip>

                      <Tooltip
                        title={
                          teacher.isActive
                            ? "Deactivate teacher"
                            : "Activate teacher"
                        }
                        arrow
                      >
                        <IconButton
                          size="small"
                          onClick={() =>
                            onToggleStatus(
                              teacher.id,
                            )
                          }
                          sx={{
                            width: 34,
                            height: 34,
                            border:
                              "1px solid",
                            borderColor:
                              "divider",
                            borderRadius:
                              1.5,
                            "&:hover": {
                              borderColor:
                                "text.primary",
                              bgcolor:
                                "action.hover",
                            },
                          }}
                        >
                          <SyncAltIcon
                            fontSize="small"
                          />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ),
            )
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}