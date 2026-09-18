import {
  UpdateClassTeacherAssignmentInput,
} from "../validators/update";

interface Input
  extends UpdateClassTeacherAssignmentInput {
  id: string;
}

export async function updateClassTeacherAssignment(
  input: Input,
) {
  const response =
    await fetch(
      `/api/class-teacher-assignment/${input.id}`,
      {
        method: "PATCH",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          teacherId:
            input.teacherId,

          sectionId:
            input.sectionId,
        }),
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