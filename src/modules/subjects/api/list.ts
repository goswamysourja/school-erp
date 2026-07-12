export async function listSubjects() {
  const response =
    await fetch(
      "/api/subjects"
    );

  const data =
    await response.json();

  if (!data.success) {
    throw new Error(
      data.message
    );
  }

  return data.subjects;
}