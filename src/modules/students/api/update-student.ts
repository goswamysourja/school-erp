export interface UpdateStudentInput {
  admissionNumber: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth?: string;
  guardianName?: string;
  phone?: string;
  address?: string;
  sectionId: string;
}

export async function updateStudent(
  studentId: string,
  input: UpdateStudentInput,
) {
  const response = await fetch(
    `/api/students/${studentId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify(input),
    },
  );

  const data =
    await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message ??
        "Failed to update student.",
    );
  }

  return data.student;
}