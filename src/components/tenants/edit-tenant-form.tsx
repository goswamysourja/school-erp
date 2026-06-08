"use client";

import {
  useState,
} from "react";

interface Props {
  id: string;
  initialName: string;
  initialSlug: string;
  initialIsActive: boolean;
}

export function EditTenantForm({
  id,
  initialName,
  initialSlug,
  initialIsActive,
}: Props) {
  const [name, setName] =
    useState(
      initialName
    );

  const [slug, setSlug] =
    useState(
      initialSlug
    );

  const [
    isActive,
    setIsActive,
  ] = useState(
    initialIsActive
  );

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    const response =
      await fetch(
        `/api/tenants/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name,
            slug,
            isActive,
          }),
        }
      );

    const data =
      await response.json();

    if (data.success) {
      alert(
        "Tenant updated"
      );

      window.location.href =
        "/dashboard/tenants";
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
        value={name}
        onChange={(e) =>
          setName(
            e.target.value
          )
        }
      />

      <input
        value={slug}
        onChange={(e) =>
          setSlug(
            e.target.value
          )
        }
      />

      <label>
        Active
      </label>

      <input
        type="checkbox"
        checked={
          isActive
        }
        onChange={(e) =>
          setIsActive(
            e.target.checked
          )
        }
      />

      <button
        type="submit"
      >
        Save
      </button>
    </form>
  );
}