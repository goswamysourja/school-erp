export async function toggleStudentStatus(
  studentId: string,
) {
  const response = await fetch(
    `/api/students/${studentId}`,
    {
      method: "DELETE",
    },
  );

  const data =
    await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message ??
        "Failed to update student status.",
    );
  }

  return data.student;
}