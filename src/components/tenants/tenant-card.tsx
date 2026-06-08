"use client";

import Link from "next/link";

import type { Tenant } from "@/modules/tenants/types/tenant.types";

interface TenantCardProps {
  tenant: Tenant;
}

export function TenantCard({
  tenant,
}: TenantCardProps) {
  async function handleToggle() {
    const response = await fetch(
      `/api/tenants/${tenant.id}`,
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
        {tenant.name}
      </h3>

      <p>
        {tenant.slug}
      </p>

      <p>
        {tenant.isActive
          ? "Active"
          : "Inactive"}
      </p>

      <Link
        href={`/dashboard/tenants/${tenant.id}/edit`}
      >
        Edit
      </Link>

      <button
        type="button"
        onClick={handleToggle}
      >
        {tenant.isActive
          ? "Deactivate"
          : "Activate"}
      </button>
    </div>
  );
}