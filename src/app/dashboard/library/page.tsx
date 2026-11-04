
import { requireLibraryAccess } from "@/modules/library/guards/require-library-access.guard";

import { LibraryDashboardClient } from "./library-dashboard-client";

export default async function LibraryDashboardPage() {
  const user = await requireLibraryAccess();

  return (
    <LibraryDashboardClient
      name={user.name}
      role={user.role}
    />
  );
}
