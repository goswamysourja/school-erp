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
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(data),
    },
  );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ??
        "Failed to update teacher.",
    );
  }

  return result;
}