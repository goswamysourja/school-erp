"use client";

import { useEffect, useState } from "react";
import type { CertificatePurpose } from "@prisma/client";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Paper,
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

import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import CloseIcon from "@mui/icons-material/Close";

import { getCertificates } from "@/modules/certificates/api/get-certificates";
import { getCertificateStudents } from "@/modules/certificates/api/get-students";
import { downloadCertificatePdf } from "@/modules/certificates/api/download-certificate-pdf";
import type { CertificateResponse } from "@/modules/certificates/types/types";

import { CreateCertificateForm } from "./create-certificate-form";

interface StudentOption {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
}

function getPurposeLabel(
  purpose: CertificatePurpose,
) {
  switch (purpose) {
    case "TRANSFER":
      return "Transfer Certificate";

    case "COMPETITION_WINNER":
      return "Competition Winner";

    case "COMPETITION_PARTICIPANT":
      return "Competition Participant";

    case "ACHIEVEMENT":
      return "Achievement";

    case "PARTICIPATION":
      return "Participation";

    default:
      return purpose;
  }
}

export function CertificateManage() {
  const [certificates, setCertificates] =
    useState<CertificateResponse[]>([]);

  const [students, setStudents] =
    useState<StudentOption[]>([]);

  const [studentId, setStudentId] =
    useState("");

  const [fromDate, setFromDate] =
    useState("");

  const [toDate, setToDate] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [downloadingId, setDownloadingId] =
    useState("");

  const [openCreateModal, setOpenCreateModal] =
    useState(false);

  async function loadCertificates() {
    try {
      setLoading(true);
      setError("");

      const data = await getCertificates({
        studentId:
          studentId || undefined,
        fromDate:
          fromDate || undefined,
        toDate:
          toDate || undefined,
      });

      setCertificates(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load certificates.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadStudents() {
    try {
      const data =
        await getCertificateStudents();

      setStudents(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load students.",
      );
    }
  }

  useEffect(() => {
    void loadStudents();
    void loadCertificates();
  }, []);

  function handleSearch() {
    void loadCertificates();
  }

  function handleReset() {
    setStudentId("");
    setFromDate("");
    setToDate("");

    void getCertificates()
      .then(setCertificates)
      .catch((err) => {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load certificates.",
        );
      });
  }

  async function handleDownload(
    certificate: CertificateResponse,
  ) {
    try {
      setDownloadingId(certificate.id);
      setError("");

      const blob =
        await downloadCertificatePdf(
          certificate.id,
        );

      const url =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        `certificate-${certificate.certificateNumber}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to download certificate PDF.",
      );
    } finally {
      setDownloadingId("");
    }
  }

  return (
    <Stack spacing={3}>
      {/* Page Header */}

      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        spacing={2}
        sx={{
          justifyContent:
            "space-between",
          alignItems: {
            sm: "center",
          },
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              letterSpacing:
                "-0.02em",
            }}
          >
            Certificates
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Generate, track, and issue
            official student certificates.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() =>
            setOpenCreateModal(true)
          }
          sx={{
            borderRadius: 2,
            textTransform: "none",
            px: 2.5,
            fontWeight: 600,
          }}
        >
          Issue Certificate
        </Button>
      </Stack>

      {/* Global Error Banner */}

      {error && (
        <Alert
          severity="error"
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      {/* Filter Bar */}

      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
        }}
      >
        <CardContent
          sx={{
            p: 2.5,
            "&:last-child": {
              pb: 2.5,
            },
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontWeight: 600,
            }}
          >
            <FilterListIcon
              fontSize="small"
              color="action"
            />

            Search & Filter
          </Typography>

          <Grid
            container
            spacing={2}
            sx={{
              alignItems: "center",
            }}
          >
            <Grid
              size={{
                xs: 12,
                sm: 4,
              }}
            >
              <TextField
                select
                fullWidth
                size="small"
                label="Student"
                value={studentId}
                onChange={(e) =>
                  setStudentId(
                    e.target.value,
                  )
                }
              >
                <MenuItem value="">
                  All Students
                </MenuItem>

                {students.map(
                  (student) => (
                    <MenuItem
                      key={student.id}
                      value={student.id}
                    >
                      {
                        student.admissionNumber
                      }{" "}
                      -{" "}
                      {student.firstName}{" "}
                      {student.lastName}
                    </MenuItem>
                  ),
                )}
              </TextField>
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 3,
              }}
            >
              <TextField
                fullWidth
                size="small"
                type="date"
                label="From Date"
                value={fromDate}
                onChange={(e) =>
                  setFromDate(
                    e.target.value,
                  )
                }
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 3,
              }}
            >
              <TextField
                fullWidth
                size="small"
                type="date"
                label="To Date"
                value={toDate}
                onChange={(e) =>
                  setToDate(
                    e.target.value,
                  )
                }
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 2,
              }}
            >
              <Stack
                direction="row"
                spacing={1}
              >
                <Button
                  variant="contained"
                  fullWidth
                  size="medium"
                  onClick={handleSearch}
                  sx={{
                    borderRadius: 1.5,
                    textTransform:
                      "none",
                  }}
                >
                  Search
                </Button>

                <IconButton
                  size="small"
                  onClick={handleReset}
                  sx={{
                    border: "1px solid",
                    borderColor:
                      "divider",
                    borderRadius: 1.5,
                  }}
                >
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Certificates Table */}

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
        }}
      >
        <Table
          sx={{
            minWidth: 650,
          }}
        >
          <TableHead
            sx={{
              bgcolor: "grey.50",
            }}
          >
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 700,
                }}
              >
                Cert No.
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                }}
              >
                Student Details
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                }}
              >
                Purpose / Type
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                }}
              >
                Issue Date
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                }}
              >
                Status
              </TableCell>

              <TableCell
                align="right"
                sx={{
                  fontWeight: 700,
                }}
              >
                Action
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  align="center"
                  sx={{
                    py: 3,
                  }}
                >
                  <Typography color="text.secondary">
                    Loading certificates...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : certificates.length ===
              0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  align="center"
                  sx={{
                    py: 4,
                  }}
                >
                  <Typography color="text.secondary">
                    No certificates found
                    matching your
                    criteria.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              certificates.map(
                (cert) => (
                  <TableRow
                    key={cert.id}
                    hover
                  >
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color:
                            "primary.main",
                        }}
                      >
                        {
                          cert.certificateNumber
                        }
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        {
                          cert.student
                            .firstName
                        }{" "}
                        {
                          cert.student
                            .lastName
                        }
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        Adm No:{" "}
                        {
                          cert.student
                            .admissionNumber
                        }
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                          alignItems:
                            "flex-start",
                        }}
                      >
                        <CardMembershipIcon
                          fontSize="small"
                          color="action"
                        />

                        <Box>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                            }}
                          >
                            {getPurposeLabel(
                              cert.purpose,
                            )}
                          </Typography>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            {
                              cert.certificateType
                            }
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      {new Date(
                        cert.issueDate,
                      ).toLocaleDateString()}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label="ISSUED"
                        size="small"
                        color="success"
                        variant="outlined"
                        sx={{
                          fontWeight: 700,
                          fontSize:
                            "0.68rem",
                        }}
                      />
                    </TableCell>

                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={
                          <DownloadIcon />
                        }
                        onClick={() =>
                          void handleDownload(
                            cert,
                          )
                        }
                        disabled={
                          downloadingId ===
                          cert.id
                        }
                        sx={{
                          borderRadius: 1.5,
                          textTransform:
                            "none",
                        }}
                      >
                        {downloadingId ===
                          cert.id
                          ? "Downloading..."
                          : "Download PDF"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ),
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Certificate Creation Modal */}
      <Dialog
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        maxWidth="md" // <-- Change this from "sm" to "md"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: 2.5,
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
          }}
        >
          Issue New Student
          Certificate

          <IconButton
            size="small"
            onClick={() =>
              setOpenCreateModal(
                false,
              )
            }
            aria-label="close"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <CreateCertificateForm
            onCreated={() => {
              setOpenCreateModal(
                false,
              );

              void loadCertificates();
            }}
          />
        </DialogContent>
      </Dialog>
    </Stack>
  );
}