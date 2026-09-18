import type {
  TeacherResponse,
} from "../types";

export async function listTeachers(): Promise<
  TeacherResponse[]
> {
  const response = await fetch("/api/teachers");

  if (!response.ok) {
    throw new Error("Failed to fetch teachers.");
  }

  return response.json();
}