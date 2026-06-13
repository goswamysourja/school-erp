import { Role } from "@prisma/client";

export interface AuthUser {
  id: string;

  role: Role;

  tenantId: string | null;
}