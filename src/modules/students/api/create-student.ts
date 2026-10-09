export interface CreateStudentInput {
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

export async function createStudent(
  input: CreateStudentInput,
) {
  const response = await fetch(
    "/api/students",
    {
      method: "POST",
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
        "Failed to create student.",
    );
  }

  return data.student;
}