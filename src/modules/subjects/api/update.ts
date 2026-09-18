import { UpdateSubjectInput } from "../validators/update-subject.validator";

interface Input
  extends UpdateSubjectInput {
  id: string;
}

export async function updateSubject(
  input: Input
) {
  const response =
    await fetch(
      `/api/subjects/${input.id}`,
      {
        method: "PATCH",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          name:
            input.name,

          code:
            input.code,

          description:
            input.description,
        }),
      }
    );

  const data =
    await response.json();

  if (!data.success) {
    throw new Error(
      data.message
    );
  }

  return data.subject;
}