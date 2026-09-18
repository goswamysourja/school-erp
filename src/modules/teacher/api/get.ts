import type {
  TeacherResponse,
} from "../types";

export async function getTeacher(
  teacherId: string,
): Promise<TeacherResponse> {
  const response = await fetch(
    `/api/teachers/${teacherId}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch teacher.");
  }

  return response.json();
}