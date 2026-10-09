"use client";

import { useEffect, useState } from "react";
import type { CertificatePurpose } from "@prisma/client";

import {
  Alert,
  Box,
  Button,
  Grid,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";

import { createCertificate } from "@/modules/certificates/api/create-certificate";
import { getCertificateStudents } from "@/modules/certificates/api/get-students";

interface StudentOption {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
}

interface CreateCertificateFormProps {
  onCreated?: () => void;
}

const certificateTypes: Record<
  CertificatePurpose,
  string
> = {
  TRANSFER: "Transfer Certificate",
  COMPETITION_WINNER:
    "Competition Winner Certificate",
  COMPETITION_PARTICIPANT:
    "Competition Participation Certificate",
  ACHIEVEMENT: "Achievement Certificate",
  PARTICIPATION:
    "Participation Certificate",
};

export function CreateCertificateForm({
  onCreated,
}: CreateCertificateFormProps) {
  const [students, setStudents] = useState<StudentOption[]>(
    [],
  );

  const [certificateNumber, setCertificateNumber] =
    useState("");

  const [purpose, setPurpose] =
    useState<CertificatePurpose | "">("");

  const [issueDate, setIssueDate] = useState("");
  const [studentId, setStudentId] = useState("");

  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [position, setPosition] = useState("");
  const [achievement, setAchievement] = useState("");
  const [details, setDetails] = useState("");

  const [loadingStudents, setLoadingStudents] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadStudents() {
      try {
        setLoadingStudents(true);
        setError("");

        const data =
          await getCertificateStudents();

        setStudents(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load students.",
        );
      } finally {
        setLoadingStudents(false);
      }
    }

    void loadStudents();
  }, []);

  function handlePurposeChange(
    value: CertificatePurpose | "",
  ) {
    setPurpose(value);

    setEventName("");
    setEventDate("");
    setPosition("");
    setAchievement("");
    setDetails("");
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!purpose) {
      setError(
        "Please select a certificate purpose.",
      );
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      await createCertificate({
        certificateNumber,
        purpose,
        certificateType:
          certificateTypes[purpose],
        issueDate,
        studentId,
        eventName:
          eventName || undefined,
        eventDate:
          eventDate || undefined,
        position:
          position || undefined,
        achievement:
          achievement || undefined,
        details:
          details || undefined,
      });

      setCertificateNumber("");
      setPurpose("");
      setIssueDate("");
      setStudentId("");
      setEventName("");
      setEventDate("");
      setPosition("");
      setAchievement("");
      setDetails("");

      setSuccess(
        "Certificate created successfully.",
      );

      onCreated?.();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create certificate.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const showEventFields =
    purpose === "COMPETITION_WINNER" ||
    purpose === "COMPETITION_PARTICIPANT" ||
    purpose === "PARTICIPATION";

  const showPosition =
    purpose === "COMPETITION_WINNER";

  const showAchievement =
    purpose === "ACHIEVEMENT";

  const showDetails =
    purpose === "TRANSFER";

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2.5} sx={{ pt: 1 }}>
        {error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success">
            {success}
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              required
              size="small"
              label="Certificate Number"
              placeholder="e.g. CERT-001"
              value={certificateNumber}
              onChange={(e) =>
                setCertificateNumber(
                  e.target.value,
                )
              }
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select
              fullWidth
              required
              size="small"
              label="Certificate Purpose"
              value={purpose}
              onChange={(e) =>
                handlePurposeChange(
                  e.target.value as
                    | CertificatePurpose
                    | "",
                )
              }
            >
              <MenuItem value="">
                Select Purpose
              </MenuItem>

              <MenuItem value="TRANSFER">
                Transfer Certificate
              </MenuItem>

              <MenuItem value="COMPETITION_WINNER">
                Competition Winner
              </MenuItem>

              <MenuItem value="COMPETITION_PARTICIPANT">
                Competition Participant
              </MenuItem>

              <MenuItem value="ACHIEVEMENT">
                Achievement
              </MenuItem>

              <MenuItem value="PARTICIPATION">
                Participation
              </MenuItem>
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              required
              size="small"
              type="date"
              label="Issue Date"
              value={issueDate}
              onChange={(e) =>
                setIssueDate(e.target.value)
              }
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              select
              fullWidth
              required
              size="small"
              label="Student"
              value={studentId}
              onChange={(e) =>
                setStudentId(e.target.value)
              }
              disabled={loadingStudents}
            >
              <MenuItem value="">
                Select Student
              </MenuItem>

              {students.map((student) => (
                <MenuItem
                  key={student.id}
                  value={student.id}
                >
                  {student.admissionNumber} -{" "}
                  {student.firstName}{" "}
                  {student.lastName}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {showEventFields && (
            <>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  required
                  size="small"
                  label="Event Name"
                  placeholder="e.g. Inter-School Football Championship"
                  value={eventName}
                  onChange={(e) =>
                    setEventName(
                      e.target.value,
                    )
                  }
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  required
                  size="small"
                  type="date"
                  label="Event Date"
                  value={eventDate}
                  onChange={(e) =>
                    setEventDate(
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
            </>
          )}

          {showPosition && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                size="small"
                label="Position"
                placeholder="e.g. 1st Position"
                value={position}
                onChange={(e) =>
                  setPosition(e.target.value)
                }
              />
            </Grid>
          )}

          {showAchievement && (
            <>
              <Grid size={{ xs: 12, sm: 8 }}>
                <TextField
                  fullWidth
                  required
                  size="small"
                  label="Achievement"
                  placeholder="e.g. Excellence in Mathematics"
                  value={achievement}
                  onChange={(e) =>
                    setAchievement(
                      e.target.value,
                    )
                  }
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  required
                  size="small"
                  type="date"
                  label="Achievement Date"
                  value={eventDate}
                  onChange={(e) =>
                    setEventDate(
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
            </>
          )}

          {showDetails && (
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                required
                multiline
                minRows={3}
                size="small"
                label="Transfer Details"
                placeholder="Enter relevant transfer details"
                value={details}
                onChange={(e) =>
                  setDetails(e.target.value)
                }
              />
            </Grid>
          )}
        </Grid>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            pt: 1,
          }}
        >
          <Button
            type="submit"
            variant="contained"
            disabled={
              submitting ||
              loadingStudents
            }
            sx={{
              borderRadius: 1.5,
              px: 3,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            {submitting
              ? "Creating..."
              : "Create Certificate"}
          </Button>
        </Box>
      </Stack>
    </form>
  );
}