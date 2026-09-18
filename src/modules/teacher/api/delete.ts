export async function deleteTeacher(
  teacherId: string,
): Promise<void> {
  const response = await fetch(
    `/api/teachers/${teacherId}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to delete teacher.");
  }
}