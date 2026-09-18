import type {
  UpdateTeacherInput,
} from "../validators";

import type {
  TeacherResponse,
} from "../types";

export async function updateTeacher(
  teacherId: string,
  data: UpdateTeacherInput,
): Promise<TeacherResponse> {
  const response = await fetch(
    `/api/teachers/${teacherId}`,
    {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(data),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to update teacher.");
  }

  return response.json();
}