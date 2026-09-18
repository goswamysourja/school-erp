import {
  CreateClassTeacherAssignmentInput,
} from "../validators/create";

export async function createClassTeacherAssignment(
  input: CreateClassTeacherAssignmentInput,
) {
  const response =
    await fetch(
      "/api/class-teacher-assignment",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(
          input,
        ),
      },
    );

  const data =
    await response.json();

  if (!data.success) {
    throw new Error(
      data.message,
    );
  }

  return data.assignment;
}