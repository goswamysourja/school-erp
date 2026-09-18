import { TenantStatus } from "@prisma/client";

export interface TenantResponse {
  id: string;
  name: string;
  slug: string;
  status: TenantStatus;
  adminUserId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export function mapTenantToResponse(
  tenant: {
    id: string;
    name: string;
    slug: string;
    status: TenantStatus;
    adminUserId: string | null;
    createdAt: Date;
    updatedAt: Date;
  }
): TenantResponse {
  return {
    id: tenant.id,
    name: tenant.name,
    slug: tenant.slug,
    status: tenant.status,
    adminUserId: tenant.adminUserId,
    createdAt: tenant.createdAt,
    updatedAt: tenant.updatedAt,
  };
}