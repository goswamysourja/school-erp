import { CreateSubjectInput }
  from "../validators/create-subject.validator";

export async function createSubject(
  input: CreateSubjectInput
) {
  const response =
    await fetch(
      "/api/subjects",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(
          input
        ),
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