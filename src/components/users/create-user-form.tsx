"use client";

import { useState } from "react";

interface Tenant {
  id: string;
  name: string;
}

interface Props {
  tenants: Tenant[];
}

export function CreateUserForm({
  tenants,
}: Props) {
  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [role, setRole] =
    useState("TEACHER");

  const [
    tenantId,
    setTenantId,
  ] = useState("");

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    const response =
      await fetch(
        "/api/users",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            role,
            tenantId,
          }),
        }
      );

    const data =
      await response.json();

    if (data.success) {
      alert(
        "User created"
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
    <form
      onSubmit={
        handleSubmit
      }
    >
      <input
        placeholder="Name"
        value={name}
        onChange={(e) =>
          setName(
            e.target.value
          )
        }
      />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) =>
          setEmail(
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
        <option value="">
          Select Tenant
        </option>

        {tenants.map(
          (tenant) => (
            <option
              key={tenant.id}
              value={
                tenant.id
              }
            >
              {tenant.name}
            </option>
          )
        )}
      </select>

      <button
        type="submit"
      >
        Create User
      </button>
    </form>
  );
}