export async function getCertificateStudents() {
  const response = await fetch("/api/students", {
    method: "GET",
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        data.error ||
        "Failed to fetch students.",
    );
  }

  return data.students;
}