"use client";

import { useRouter } from "next/navigation";

import {
  Box,
} from "@mui/material";

import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";

import {
  toggleTeacherStatus,
} from "../api";

import { TeacherTable } from "../components/teacher-table";

import type {
  TeacherResponse,
} from "../types";

interface Props {
  teachers: TeacherResponse[];
}

export function TeacherListPage({
  teachers,
}: Props) {
  const router = useRouter();

  async function handleToggleStatus(
    teacherId: string,
  ) {
    const confirmed = confirm(
      "Are you sure you want to change this teacher's status?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await toggleTeacherStatus(
        teacherId,
      );

      router.refresh();
    } catch (error) {
      console.error(error);

      alert(
        "Failed to update teacher status.",
      );
    }
  }

  return (
    <>
      <PageHeader
        title="Teachers"
        subtitle="Manage teacher records"
      />

      <Box sx={{ mt: 3 }}>
        {teachers.length === 0 ? (
          <EmptyState
            title="No teachers found."
            description="No teacher profiles have been created yet."
          />
        ) : (
          <TeacherTable
            teachers={teachers}
            onEdit={(teacherId) =>
              router.push(
                `/dashboard/teachers/${teacherId}/edit`,
              )
            }
            onToggleStatus={
              handleToggleStatus
            }
          />
        )}
      </Box>
    </>
  );
}