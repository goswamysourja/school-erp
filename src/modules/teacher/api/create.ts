import type {
  CreateTeacherInput,
} from "../validators";

import type {
  TeacherResponse,
} from "../types";

export async function createTeacher(
  data: CreateTeacherInput,
): Promise<TeacherResponse> {
  const response = await fetch("/api/teachers", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),
  });

  if (!response.ok) {
  const errorData = await response.json();

  console.error(
    "CREATE TEACHER API ERROR:",
    errorData,
  );

  throw new Error(
    errorData.message ??
      "Failed to create teacher.",
  );
}

return response.json();
}