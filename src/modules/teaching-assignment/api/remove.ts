export async function removeTeachingAssignment(
  id: string,
) {
  const response =
    await fetch(
      `/api/teaching-assignment/${id}`,
      {
        method: "DELETE",
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