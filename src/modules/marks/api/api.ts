import type {
  CreateMarkInput,
  UpdateMarkInput,
} from "../validators/validator";

import type {
  MarkResponse,
} from "../types/types";

interface ApiResponse {
  success: boolean;
  message?: string;
  mark?: MarkResponse;
  marks?: MarkResponse[];
}

interface ListMarksParams {
  studentId?: string;
  teachingAssignmentId?: string;
  academicPeriodId?: string;
}

async function request(
  url: string,
  options?: RequestInit,
): Promise<ApiResponse> {
  const response = await fetch(
    url,
    {
      ...options,

      headers: {
        "Content-Type":
          "application/json",
        ...options?.headers,
      },
    },
  );

  const data =
    await response.json();

  if (
    !response.ok ||
    !data.success
  ) {
    throw new Error(
      data.message ??
        "Something went wrong.",
    );
  }

  return data;
}

export async function listMarks(
  params: ListMarksParams = {},
) {
  const searchParams =
    new URLSearchParams();

  if (params.studentId) {
    searchParams.set(
      "studentId",
      params.studentId,
    );
  }

  if (
    params.teachingAssignmentId
  ) {
    searchParams.set(
      "teachingAssignmentId",
      params.teachingAssignmentId,
    );
  }

  if (params.academicPeriodId) {
    searchParams.set(
      "academicPeriodId",
      params.academicPeriodId,
    );
  }

  const query =
    searchParams.toString();

  return request(
    query
      ? `/api/marks?${query}`
      : "/api/marks",
  );
}

export async function getMark(
  id: string,
) {
  return request(
    `/api/marks/${id}`,
  );
}

export async function createMark(
  input: CreateMarkInput,
) {
  return request(
    "/api/marks",
    {
      method: "POST",

      body: JSON.stringify(
        input,
      ),
    },
  );
}

export async function updateMark(
  id: string,
  input: UpdateMarkInput,
) {
  return request(
    `/api/marks/${id}`,
    {
      method: "PATCH",

      body: JSON.stringify(
        input,
      ),
    },
  );
}