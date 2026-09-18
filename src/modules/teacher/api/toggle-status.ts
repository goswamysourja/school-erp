import type {
  TeacherResponse,
} from "../types";

export async function toggleTeacherStatus(
  teacherId: string,
): Promise<TeacherResponse> {
  const response = await fetch(
    `/api/teachers/${teacherId}/toggle-status`,
    {
      method: "PATCH",
    },
  );

  if (!response.ok) {
    throw new Error(
      "Failed to update teacher status.",
    );
  }

  return response.json();
}