"use client";

import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";

import {
  listClassTeacherAssignments,
} from "../api/list";

import {
  removeClassTeacherAssignment,
} from "../api/remove";

import {
  listTeachers,
} from "@/modules/teacher/api/list";

import {
  listSections,
} from "../api/list-sections";

import ClassTeacherAssignmentForm
  from "./form";

import ClassTeacherAssignmentEditForm
  from "./edit-form";

import ClassTeacherAssignmentList
  from "./list";

import type {
  ClassTeacherAssignmentResponse,
  ClassTeacherSectionOption,
  ClassTeacherTeacherOption,
} from "../types/types";

export default function ClassTeacherAssignmentManage() {
  const [
    assignments,
    setAssignments,
  ] = useState<
    ClassTeacherAssignmentResponse[]
  >([]);

  const [
    teachers,
    setTeachers,
  ] = useState<
    ClassTeacherTeacherOption[]
  >([]);

  const [
    sections,
    setSections,
  ] = useState<
    ClassTeacherSectionOption[]
  >([]);

  const [
    selectedAssignment,
    setSelectedAssignment,
  ] = useState<
    ClassTeacherAssignmentResponse | null
  >(null);

  const [
    createOpen,
    setCreateOpen,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    deletingId,
    setDeletingId,
  ] = useState<string | null>(null);

  async function loadData() {
    setError("");

    try {
      setLoading(true);

      const [
        assignmentData,
        teacherData,
        sectionData,
      ] = await Promise.all([
        listClassTeacherAssignments(),
        listTeachers(),
        listSections(),
      ]);

      setAssignments(
        assignmentData,
      );

      setTeachers(
        teacherData,
      );

      setSections(
        sectionData,
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load class teacher assignments.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function refreshAssignments() {
    try {
      const data =
        await listClassTeacherAssignments();

      setAssignments(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to refresh assignments.",
      );
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleDelete(
    assignment: ClassTeacherAssignmentResponse,
  ) {
    const teacherName =
      `${assignment.teacher.firstName} ${assignment.teacher.lastName}`;

    const confirmed =
      window.confirm(
        `Remove ${teacherName} as class teacher of ${assignment.section.class.name} - ${assignment.section.name}?`,
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setDeletingId(
        assignment.id,
      );

      await removeClassTeacherAssignment(
        assignment.id,
      );

      await refreshAssignments();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to remove class teacher assignment.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  function handleCreateClose() {
    setCreateOpen(false);
    refreshAssignments();
  }

  function handleEditClose() {
    setSelectedAssignment(null);
    refreshAssignments();
  }

  return (
    <Stack spacing={3}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Typography variant="h6">
          Class Teacher Assignments
        </Typography>

        <Button
          variant="contained"
          onClick={() =>
            setCreateOpen(true)
          }
        >
          Assign Class Teacher
        </Button>
      </Box>

      {error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 6,
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <ClassTeacherAssignmentList
          assignments={assignments}
          onEdit={setSelectedAssignment}
          onDelete={handleDelete}
        />
      )}

      {createOpen && (
        <ClassTeacherAssignmentForm
          teachers={teachers}
          sections={sections}
          onClose={handleCreateClose}
        />
      )}

      {selectedAssignment && (
        <ClassTeacherAssignmentEditForm
          assignment={
            selectedAssignment
          }
          teachers={teachers}
          sections={sections}
          onClose={handleEditClose}
        />
      )}

      {deletingId && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            textAlign: "right",
          }}
        >
          Removing assignment...
        </Typography>
      )}
    </Stack>
  );
}