"use client";

import Link from "next/link";

import type { User, Tenant } from "@prisma/client";

interface UserCardProps {
  user: User & {
    tenant: Tenant | null;
  };
}

export function UserCard({
  user,
}: UserCardProps) {
  async function handleToggle() {
    const response =
      await fetch(
        `/api/users/${user.id}`,
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
        {user.name}
      </h3>

      <p>
        {user.email}
      </p>

      <p>
        {user.role}
      </p>

      <p>
        {user.tenant?.name ??
          "No Tenant"}
      </p>

      <p>
        {user.isActive
          ? "Active"
          : "Inactive"}
      </p>

      <Link
        href={`/dashboard/users/${user.id}/edit`}
      >
        Edit
      </Link>

      <button
        type="button"
        onClick={handleToggle}
      >
        {user.isActive
          ? "Deactivate"
          : "Activate"}
      </button>
    </div>
  );
}