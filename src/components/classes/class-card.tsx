"use client";

import Link from "next/link";

import type {
  Class,
  Tenant,
  User,
} from "@prisma/client";

interface ClassCardProps {
  classItem: Class & {
    tenant: Tenant;
    classTeacher: User | null;
  };
}

export function ClassCard({
  classItem,
}: ClassCardProps) {
  async function handleToggle() {
    const response =
      await fetch(
        `/api/classes/${classItem.id}`,
        {
          method: "DELETE",
        }
      );

    const data =
      await response.json();

    if (data.success) {
      window.location.reload();
    } else {
      alert(data.message);
    }
  }

  return (
    <div>
      <h3>
        {classItem.name}
      </h3>

      <p>
        Section: {classItem.section}
      </p>

      <p>
        Academic Year:{" "}
        {classItem.academicYear}
      </p>

      <p>
        Tenant:{" "}
        {classItem.tenant.name}
      </p>

      <p>
        Teacher:{" "}
        {classItem.classTeacher?.name ??
          "No Teacher"}
      </p>

      <p>
        {classItem.isActive
          ? "Active"
          : "Inactive"}
      </p>

      <Link
        href={`/dashboard/classes/${classItem.id}/edit`}
      >
        Edit
      </Link>

      <button
        type="button"
        onClick={handleToggle}
      >
        {classItem.isActive
          ? "Deactivate"
          : "Activate"}
      </button>
    </div>
  );
}