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

import { createClassTeacherAssignment } from "../api/create";
import type {
    ClassTeacherSectionOption,
    ClassTeacherTeacherOption,
} from "../types/types";

interface ClassTeacherAssignmentFormProps {
    teachers: ClassTeacherTeacherOption[];
    sections: ClassTeacherSectionOption[];
    onClose: () => void;
}

export default function ClassTeacherAssignmentForm({
    teachers,
    sections,
    onClose,
}: ClassTeacherAssignmentFormProps) {
    const [teacherId, setTeacherId] = useState("");
    const [sectionId, setSectionId] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const activeTeachers = useMemo(
        () =>
            teachers.filter(
                (teacher) => teacher.isActive,
            ),
        [teachers],
    );

    const activeSections = useMemo(
        () =>
            sections.filter(
                (section) =>
                    section.isActive &&
                    section.class.isActive,
            ),
        [sections],
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

            await createClassTeacherAssignment({
                teacherId,
                sectionId,
            });

            onClose();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to assign class teacher.",
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
                Assign Class Teacher
            </DialogTitle>

            <DialogContent>
                <Stack spacing={2.5} sx={{ mt: 1 }}>
                    {error && (
                        <Alert severity="error">
                            {error}
                        </Alert>
                    )}

                    <FormControl fullWidth>
                        <InputLabel id="class-teacher-label">
                            Teacher
                        </InputLabel>

                        <Select
                            labelId="class-teacher-label"
                            value={teacherId}
                            label="Teacher"
                            onChange={(event) =>
                                setTeacherId(event.target.value)
                            }
                            disabled={submitting}
                        >
                            {activeTeachers.map((teacher) => (
                                <MenuItem
                                    key={teacher.id}
                                    value={teacher.id}
                                >
                                    {teacher.firstName} {teacher.lastName}{" "}
                                    ({teacher.employeeId})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel id="section-label">
                            Section
                        </InputLabel>

                        <Select
                            labelId="section-label"
                            value={sectionId}
                            label="Section"
                            onChange={(event) =>
                                setSectionId(event.target.value)
                            }
                            disabled={submitting}
                        >
                            {activeSections.map((section) => (
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
                    {submitting ? "Assigning..." : "Assign"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}