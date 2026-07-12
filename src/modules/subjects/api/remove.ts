export async function removeSubject(
  id: string
) {
  const response =
    await fetch(
      `/api/subjects/${id}`,
      {
        method: "DELETE",
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