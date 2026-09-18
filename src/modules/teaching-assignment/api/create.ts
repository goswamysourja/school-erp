import { CreateTeachingAssignmentInput }
  from "../validators/create";

export async function createTeachingAssignment(
  input: CreateTeachingAssignmentInput,
) {
  const response =
    await fetch(
      "/api/teaching-assignment",
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