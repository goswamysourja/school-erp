export async function listTeachingAssignments() {
  const response =
    await fetch(
      "/api/teaching-assignment",
      {
        method: "GET",
      },
    );

  const data =
    await response.json();

  if (!data.success) {
    throw new Error(
      data.message,
    );
  }

  return data.assignments;
}