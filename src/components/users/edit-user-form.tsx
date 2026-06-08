"use client";

import { useState } from "react";

interface Tenant {
  id: string;
  name: string;
}

interface Props {
  id: string;
  initialName: string;
  initialRole: string;
  initialTenantId: string;
  tenants: Tenant[];
}

export function EditUserForm({
  id,
  initialName,
  initialRole,
  initialTenantId,
  tenants,
}: Props) {
  const [name, setName] =
    useState(initialName);

  const [role, setRole] =
    useState(initialRole);

  const [tenantId, setTenantId] =
    useState(initialTenantId);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    const response =
      await fetch(
        `/api/users/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name,
            role,
            tenantId,
          }),
        }
      );

    const data =
      await response.json();

    if (data.success) {
      alert(
        "User updated"
      );

      window.location.href =
        "/dashboard/users";
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

      <select
        value={role}
        onChange={(e) =>
          setRole(
            e.target.value
          )
        }
      >
        <option value="ADMIN">
          ADMIN
        </option>

        <option value="TEACHER">
          TEACHER
        </option>

        <option value="STUDENT">
          STUDENT
        </option>
      </select>

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

      <button type="submit">
        Save
      </button>
    </form>
  );
}