"use client";

import { useMemo, useState } from "react";

import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";

import { updateClassTeacherAssignment } from "../api/update";

import type {
  ClassTeacherAssignmentResponse,
  ClassTeacherSectionOption,
  ClassTeacherTeacherOption,
} from "../types/types";

interface ClassTeacherAssignmentEditFormProps {
  assignment: ClassTeacherAssignmentResponse;
  teachers: ClassTeacherTeacherOption[];
  sections: ClassTeacherSectionOption[];
  onClose: () => void;
}

export default function ClassTeacherAssignmentEditForm({
  assignment,
  teachers,
  sections,
  onClose,
}: ClassTeacherAssignmentEditFormProps) {
  const [teacherId, setTeacherId] = useState(
    assignment.teacher.id,
  );

  const [sectionId, setSectionId] = useState(
    assignment.section.id,
  );

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const teacherOptions = useMemo(
    () =>
      teachers.filter(
        (teacher) =>
          teacher.isActive ||
          teacher.id === assignment.teacher.id,
      ),
    [teachers, assignment.teacher.id],
  );

  const sectionOptions = useMemo(
    () =>
      sections.filter(
        (section) =>
          (section.isActive &&
            section.class.isActive) ||
          section.id === assignment.section.id,
      ),
    [sections, assignment.section.id],
  );

  const handleSubmit = async () => {
    setError("");

    if (!teacherId) {
      setError("Teacher is required.");
      return;
    }

    if (!sectionId) {
      setError("Section is required.");
      return;
    }

    try {
      setSubmitting(true);

      await updateClassTeacherAssignment({
        id: assignment.id,
        teacherId,
        sectionId,
      });

      onClose();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update class teacher assignment.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open
      onClose={submitting ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        Edit Class Teacher Assignment
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          {error && (
            <Alert severity="error">
              {error}
            </Alert>
          )}

          <FormControl fullWidth>
            <InputLabel id="edit-class-teacher-label">
              Teacher
            </InputLabel>

            <Select
              labelId="edit-class-teacher-label"
              value={teacherId}
              label="Teacher"
              onChange={(event) =>
                setTeacherId(event.target.value)
              }
              disabled={submitting}
            >
              {teacherOptions.map((teacher) => (
                <MenuItem
                  key={teacher.id}
                  value={teacher.id}
                >
                  {teacher.firstName}{" "}
                  {teacher.lastName}{" "}
                  ({teacher.employeeId})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="edit-section-label">
              Section
            </InputLabel>

            <Select
              labelId="edit-section-label"
              value={sectionId}
              label="Section"
              onChange={(event) =>
                setSectionId(event.target.value)
              }
              disabled={submitting}
            >
              {sectionOptions.map((section) => (
                <MenuItem
                  key={section.id}
                  value={section.id}
                >
                  {section.class.name} -{" "}
                  {section.name} (
                  {section.class.academicYear})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          disabled={submitting}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={
            submitting ||
            !teacherId ||
            !sectionId
          }
        >
          {submitting ? "Updating..." : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}