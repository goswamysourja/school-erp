
import { Role } from "@prisma/client";

import { requireRole } from "@/modules/auth/guards/require-role.guard";

import { LibrarySettingsClient } from "./library-settings-client";

export default async function LibrarySettingsPage() {
  await requireRole([Role.ADMIN]);

  return <LibrarySettingsClient />;
}
