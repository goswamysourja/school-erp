export async function removeClassTeacherAssignment(
  id: string,
) {
  const response =
    await fetch(
      `/api/class-teacher-assignment/${id}`,
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