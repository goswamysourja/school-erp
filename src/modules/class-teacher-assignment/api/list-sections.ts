import type {
  ClassTeacherSectionOption,
} from "../types/types";

export async function listSections(): Promise<
  ClassTeacherSectionOption[]
> {
  const response = await fetch("/api/sections");

  if (!response.ok) {
    throw new Error("Failed to fetch sections.");
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message);
  }

  return data.sections;
}