"use client";

import { useState } from "react";

export default function CreateTenantPage() {
  const [name, setName] =
    useState("");

  const [slug, setSlug] =
    useState("");

  const handleSubmit =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      const response =
        await fetch(
          "/api/tenants",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              name,
              slug,
            }),
          }
        );

      const data =
        await response.json();

      alert(
        data.success
          ? "Tenant created"
          : data.message
      );
    };

  return (
    <main>
      <h1>Create Tenant</h1>

      <form
        onSubmit={
          handleSubmit
        }
      >
        <input
          placeholder="Tenant Name"
          value={name}
          onChange={(e) =>
            setName(
              e.target.value
            )
          }
        />

        <input
          placeholder="Tenant Slug"
          value={slug}
          onChange={(e) =>
            setSlug(
              e.target.value
            )
          }
        />

        <button type="submit">
          Create Tenant
        </button>
      </form>
    </main>
  );
}