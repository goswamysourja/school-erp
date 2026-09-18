export interface Tenant {
  id: string;
  name: string;
  slug: string;
  status:
    | "PENDING"
    | "PENDING_ADMIN"
    | "ACTIVE"
    | "INACTIVE"
    | "SUSPENDED"
    | "REJECTED";
  adminUserId: string | null;
  createdAt: Date;
  updatedAt: Date;
}