import type { Tenant } from "@/modules/tenants/types/tenant.types";
import Link from "next/link";

interface TenantCardProps {
  tenant: Tenant;
}

export function TenantCard({
  tenant,
}: TenantCardProps) {
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
    </div>
  );
}