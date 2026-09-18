"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { PageHeader } from "@/components/ui/page-header";

import { createTeacher } from "../api";

import { TeacherForm } from "../components/teacher-form";

import type {
  TeacherFormValues,
} from "../types";

interface Props {
  userId: string;
  userName: string;
  userPhone: string;
}

export function CreateTeacherPage({
  userId,
  userName,
  userPhone,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    values: TeacherFormValues,
  ) {
    try {
      setLoading(true);

      await createTeacher({
        ...values,
        userId,
      });

      router.push(
        "/dashboard/teachers",
      );

      router.refresh();
    } catch (error) {
      console.error(error);

      alert(
        "Failed to create teacher.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Complete Teacher Profile"
        subtitle="Complete the teacher profile for the existing user"
      />

      <TeacherForm
        mode="create"
        userName={userName}
        userPhone={userPhone}
        loading={loading}
        onSubmit={handleSubmit}
        onCancel={() =>
          router.push(
            "/dashboard/users",
          )
        }
      />
    </>
  );
}