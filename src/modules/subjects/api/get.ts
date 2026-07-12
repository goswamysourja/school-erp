export async function getSubject(
  id: string
) {
  const response =
    await fetch(
      `/api/subjects/${id}`
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