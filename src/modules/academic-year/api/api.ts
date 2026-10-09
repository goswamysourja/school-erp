import type {
  AcademicYearResponse,
} from "../types/types";

import type {
  AcademicPeriodResponse,
} from "../types/period.types";

interface AcademicYearInput {
  name: string;
  startDate: string;
  endDate: string;
}

interface AcademicPeriodInput {
  name: string;
  type: "TERM" | "EXAM";
  startDate: string;
  endDate: string;
  academicYearId: string;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  academicYear?: T;
  academicYears?: T[];
  period?: T;
  periods?: T[];
}

async function request<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message ?? "Something went wrong."
    );
  }

  return data;
}

export async function createAcademicYear(
  input: AcademicYearInput
) {
  return request<AcademicYearResponse>(
    "/api/academic-years",
    {
      method: "POST",
      body: JSON.stringify(input),
    }
  );
}

export async function updateAcademicYear(
  id: string,
  input: AcademicYearInput
) {
  return request<AcademicYearResponse>(
    `/api/academic-years/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    }
  );
}

export async function deleteAcademicYear(id: string) {
  return request<AcademicYearResponse>(
    `/api/academic-years/${id}`,
    {
      method: "DELETE",
    }
  );
}

export async function toggleAcademicYear(id: string) {
  return request<AcademicYearResponse>(
    `/api/academic-years/${id}/toggle`,
    {
      method: "PATCH",
    }
  );
}

export async function createAcademicPeriod(
  input: AcademicPeriodInput
) {
  return request<AcademicPeriodResponse>(
    `/api/academic-years/${input.academicYearId}/periods`,
    {
      method: "POST",
      body: JSON.stringify(input),
    }
  );
}

export async function updateAcademicPeriod(
  academicYearId: string,
  periodId: string,
  input: AcademicPeriodInput
) {
  return request<AcademicPeriodResponse>(
    `/api/academic-years/${academicYearId}/periods/${periodId}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    }
  );
}

export async function deleteAcademicPeriod(
  academicYearId: string,
  periodId: string
) {
  return request<AcademicPeriodResponse>(
    `/api/academic-years/${academicYearId}/periods/${periodId}`,
    {
      method: "DELETE",
    }
  );
}

export async function updateMarksWindow(
  academicYearId: string,
  periodId: string,
  action: "open" | "lock"
) {
  return request<AcademicPeriodResponse>(
    `/api/academic-years/${academicYearId}/periods/${periodId}/marks-window`,
    {
      method: "PATCH",
      body: JSON.stringify({
        action,
      }),
    }
  );
}