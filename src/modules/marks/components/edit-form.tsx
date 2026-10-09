"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  Alert,
  Button,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";

import { FormCard } from "@/components/ui/form-card";

import { updateMark } from "../api/api";

interface Student {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;

  section: {
    id: string;
    name: string;

    class: {
      name: string;
      academicYear: string;
    } | null;
  } | null;
}

interface TeachingAssignment {
  id: string;

  teacher: {
    firstName: string;
    lastName: string;
  };

  section: {
    id: string;
    name: string;

    class: {
      name: string;
      academicYear: string;
    };
  };

  subject: {
    name: string;
    code: string;
  };
}

interface AcademicPeriod {
  id: string;
  name: string;
  type: "TERM" | "EXAM";
  marksUploadOpen: boolean;

  academicYear: {
    name: string;
  };
}

interface Props {
  id: string;

  initialStudentId: string;
  initialTeachingAssignmentId: string;
  initialAcademicPeriodId: string;
  initialMarks: number;
  initialMaxMarks: number;

  students: Student[];
  teachingAssignments: TeachingAssignment[];
  academicPeriods: AcademicPeriod[];
}

export function EditMarkForm({
  id,
  initialStudentId,
  initialTeachingAssignmentId,
  initialAcademicPeriodId,
  initialMarks,
  initialMaxMarks,
  students,
  teachingAssignments,
  academicPeriods,
}: Props) {
  const [studentId, setStudentId] =
    useState(initialStudentId);

  const [
    teachingAssignmentId,
    setTeachingAssignmentId,
  ] = useState(
    initialTeachingAssignmentId,
  );

  const [
    academicPeriodId,
    setAcademicPeriodId,
  ] = useState(
    initialAcademicPeriodId,
  );

  const [marks, setMarks] =
    useState(
      String(initialMarks),
    );

  const [maxMarks, setMaxMarks] =
    useState(
      String(initialMaxMarks),
    );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const selectedAssignment =
    teachingAssignments.find(
      (assignment) =>
        assignment.id ===
        teachingAssignmentId,
    );

  const filteredStudents =
    useMemo(() => {
      if (!selectedAssignment) {
        return [];
      }

      return students.filter(
        (student) =>
          student.section?.id ===
          selectedAssignment.section.id,
      );
    }, [
      students,
      selectedAssignment,
    ]);

  const filteredAcademicPeriods =
    useMemo(() => {
      if (!selectedAssignment) {
        return [];
      }

      return academicPeriods.filter(
        (period) =>
          period.marksUploadOpen &&
          period.academicYear.name ===
            selectedAssignment.section
              .class.academicYear,
      );
    }, [
      academicPeriods,
      selectedAssignment,
    ]);

  function handleTeachingAssignmentChange(
    value: string,
  ) {
    setTeachingAssignmentId(
      value,
    );

    setStudentId("");
    setAcademicPeriodId("");
  }

  async function handleSubmit(
    e: React.FormEvent,
  ) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await updateMark(id, {
        studentId,
        teachingAssignmentId,
        academicPeriodId,
        marks: Number(marks),
        maxMarks: Number(maxMarks),
      });

      window.location.href =
        "/dashboard/marks";
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update marks.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormCard>
      <form
        onSubmit={handleSubmit}
      >
        <Stack spacing={3}>
          {error && (
            <Alert severity="error">
              {error}
            </Alert>
          )}

          <TextField
            select
            label="Teaching Assignment"
            value={
              teachingAssignmentId
            }
            onChange={(e) =>
              handleTeachingAssignmentChange(
                e.target.value,
              )
            }
            fullWidth
            required
            disabled={loading}
          >
            <MenuItem
              value=""
              disabled
            >
              Select Teaching Assignment
            </MenuItem>

            {teachingAssignments.map(
              (assignment) => (
                <MenuItem
                  key={assignment.id}
                  value={assignment.id}
                >
                  {assignment.subject.name}
                  {" — "}
                  {assignment.section.class.name}
                  {" - "}
                  {assignment.section.name}
                  {" ("}
                  {
                    assignment.section
                      .class.academicYear
                  }
                  {") — "}
                  {assignment.teacher
                    .firstName}{" "}
                  {assignment.teacher
                    .lastName}
                </MenuItem>
              ),
            )}
          </TextField>

          <TextField
            select
            label="Student"
            value={studentId}
            onChange={(e) =>
              setStudentId(
                e.target.value,
              )
            }
            fullWidth
            required
            disabled={
              loading ||
              !teachingAssignmentId
            }
          >
            <MenuItem
              value=""
              disabled
            >
              {teachingAssignmentId
                ? "Select Student"
                : "Select Teaching Assignment First"}
            </MenuItem>

            {filteredStudents.map(
              (student) => (
                <MenuItem
                  key={student.id}
                  value={student.id}
                >
                  {student.firstName}{" "}
                  {student.lastName}
                  {" — "}
                  {student.admissionNumber}
                </MenuItem>
              ),
            )}
          </TextField>

          <TextField
            select
            label="Academic Period"
            value={
              academicPeriodId
            }
            onChange={(e) =>
              setAcademicPeriodId(
                e.target.value,
              )
            }
            fullWidth
            required
            disabled={
              loading ||
              !teachingAssignmentId
            }
          >
            <MenuItem
              value=""
              disabled
            >
              {teachingAssignmentId
                ? "Select Academic Period"
                : "Select Teaching Assignment First"}
            </MenuItem>

            {filteredAcademicPeriods.map(
              (period) => (
                <MenuItem
                  key={period.id}
                  value={period.id}
                >
                  {period.name}
                  {" — "}
                  {period.type === "EXAM"
                    ? "Exam"
                    : "Term"}
                  {" ("}
                  {
                    period.academicYear
                      .name
                  }
                  {")"}
                </MenuItem>
              ),
            )}
          </TextField>

          <TextField
            label="Marks"
            type="number"
            value={marks}
            onChange={(e) =>
              setMarks(
                e.target.value,
              )
            }
            slotProps={{
              htmlInput: {
                min: 0,
                step: "any",
              },
            }}
            fullWidth
            required
            disabled={loading}
          />

          <TextField
            label="Maximum Marks"
            type="number"
            value={maxMarks}
            onChange={(e) =>
              setMaxMarks(
                e.target.value,
              )
            }
            slotProps={{
              htmlInput: {
                min: 0,
                step: "any",
              },
            }}
            fullWidth
            required
            disabled={loading}
          />

          <Stack
            direction="row"
            spacing={2}
          >
            <Button
              variant="outlined"
              href="/dashboard/marks"
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={
                loading ||
                !studentId ||
                !teachingAssignmentId ||
                !academicPeriodId
              }
            >
              {loading
                ? "Saving..."
                : "Save Changes"}
            </Button>
          </Stack>
        </Stack>
      </form>
    </FormCard>
  );
}