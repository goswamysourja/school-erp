"use client";

import { useState } from "react";

interface Tenant {
  id: string;
  name: string;
}

interface Teacher {
  id: string;
  name: string;
}

interface Props {
  id: string;

  initialName: string;
  initialSection: string;
  initialAcademicYear: string;

  initialTenantId: string;

  initialClassTeacherId: string;

  tenants: Tenant[];
  teachers: Teacher[];
}

export function EditClassForm({
  id,

  initialName,
  initialSection,
  initialAcademicYear,

  initialTenantId,

  initialClassTeacherId,

  tenants,
  teachers,
}: Props) {
  const [name, setName] =
    useState(initialName);

  const [section, setSection] =
    useState(initialSection);

  const [
    academicYear,
    setAcademicYear,
  ] = useState(
    initialAcademicYear
  );

  const [tenantId, setTenantId] =
    useState(initialTenantId);

  const [
    classTeacherId,
    setClassTeacherId,
  ] = useState(
    initialClassTeacherId
  );

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    const response =
      await fetch(
        `/api/classes/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name,
            section,
            academicYear,
            tenantId,
            classTeacherId:
              classTeacherId ||
              undefined,
          }),
        }
      );

    const data =
      await response.json();

    if (data.success) {
      alert(
        "Class updated"
      );

      window.location.href =
        "/dashboard/classes";
    } else {
      alert(
        data.message
      );
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) =>
          setName(
            e.target.value
          )
        }
      />

      <input
        value={section}
        onChange={(e) =>
          setSection(
            e.target.value
          )
        }
      />

      <input
        value={academicYear}
        onChange={(e) =>
          setAcademicYear(
            e.target.value
          )
        }
      />

      <select
        value={tenantId}
        onChange={(e) =>
          setTenantId(
            e.target.value
          )
        }
      >
        {tenants.map(
          (tenant) => (
            <option
              key={tenant.id}
              value={tenant.id}
            >
              {tenant.name}
            </option>
          )
        )}
      </select>

      <select
        value={classTeacherId}
        onChange={(e) =>
          setClassTeacherId(
            e.target.value
          )
        }
      >
        <option value="">
          No Teacher
        </option>

        {teachers.map(
          (teacher) => (
            <option
              key={teacher.id}
              value={teacher.id}
            >
              {teacher.name}
            </option>
          )
        )}
      </select>

      <button type="submit">
        Save
      </button>
    </form>
  );
}