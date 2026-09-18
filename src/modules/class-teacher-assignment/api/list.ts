export async function listClassTeacherAssignments() {
  const response =
    await fetch(
      "/api/class-teacher-assignment",
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