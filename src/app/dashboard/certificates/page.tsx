import { Role } from "@prisma/client";

import { CertificateManage } from "@/components/certificates/certificate-manage";
import { requireRole } from "@/modules/auth/guards/require-role.guard";

export default async function CertificatesPage() {
  await requireRole([Role.ADMIN]);

  return <CertificateManage />;
}