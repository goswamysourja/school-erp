import { requireRole } from "@/modules/auth/guards/require-role.guard";
import { Role } from "@prisma/client";

import type { Tenant } from "@/modules/tenants/types/tenant.types";
import { getTenants } from "@/modules/tenants/services/get-tenants.service";

export default async function TenantsPage() {
    await requireRole([
        Role.SUPER_ADMIN,
    ]);

    const tenants =
        await getTenants();

    return (
        <main>
            <h1>Tenants</h1>

            {tenants.map(
                (tenant: Tenant) => (
                    <div
                        key={tenant.id}
                    >
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
                    </div>
                )
            )}
        </main>
    );
}