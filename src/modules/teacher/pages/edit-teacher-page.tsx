"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { PageHeader } from "@/components/ui/page-header";

import { TeacherForm } from "../components/teacher-form";

import {
  mapTeacherToFormValues,
} from "../mapper";

import {
  updateTeacher,
} from "../api";

import type {
  TeacherFormValues,
  TeacherResponse,
} from "../types";

interface Props {
  teacher: TeacherResponse;
}

export function EditTeacherPage({
  teacher,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

 async function handleSubmit(
  values: TeacherFormValues,
) {
  try {
    setLoading(true);

    const {
      ...updateData
    } = values;

    await updateTeacher(
      teacher.id,
      updateData,
    );

    router.push(
      "/dashboard/teachers",
    );

    router.refresh();
  } catch (error) {
    console.error(error);

    alert(
      "Failed to update teacher.",
    );
  } finally {
    setLoading(false);
  }
}

  return (
    <>
      <PageHeader
        title="Edit Teacher"
        subtitle="Update teacher information"
      />

      <TeacherForm
        mode="edit"
        initialValues={mapTeacherToFormValues(
          teacher,
        )}
        loading={loading}
        onSubmit={handleSubmit}
        onCancel={() =>
          router.push(
            "/dashboard/teachers",
          )
        }
      />
    </>
  );
}