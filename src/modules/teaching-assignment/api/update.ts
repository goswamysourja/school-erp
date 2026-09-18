import { UpdateTeachingAssignmentInput }
  from "../validators/update";

interface Input
  extends UpdateTeachingAssignmentInput {
  id: string;
}

export async function updateTeachingAssignment(
  input: Input,
) {
  const response =
    await fetch(
      `/api/teaching-assignment/${input.id}`,
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

          subjectId:
            input.subjectId,
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