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
  tenants: Tenant[];
  teachers: Teacher[];
}

export function CreateClassForm({
  tenants,
  teachers,
}: Props) {
  const [name, setName] =
    useState("");

  const [section, setSection] =
    useState("");

  const [
    academicYear,
    setAcademicYear,
  ] = useState("");

  const [tenantId, setTenantId] =
    useState("");

  const [
    classTeacherId,
    setClassTeacherId,
  ] = useState("");

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    const response =
      await fetch(
        "/api/classes",
        {
          method: "POST",
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
              classTeacherId || undefined,
          }),
        }
      );

    const data =
      await response.json();

    if (data.success) {
      alert(
        "Class created"
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
        placeholder="Class"
        value={name}
        onChange={(e) =>
          setName(
            e.target.value
          )
        }
      />

      <input
        placeholder="Section"
        value={section}
        onChange={(e) =>
          setSection(
            e.target.value
          )
        }
      />

      <input
        placeholder="Academic Year"
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
        <option value="">
          Select Tenant
        </option>

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
        Create Class
      </button>
    </form>
  );
}