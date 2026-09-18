export async function getClassTeacherAssignment(
  id: string,
) {
  const response =
    await fetch(
      `/api/class-teacher-assignment/${id}`,
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

  return data.assignment;
}