import { Tenant } from "./tenant.types";

export interface GetTenantsResponse {
  success: boolean;
  tenants: Tenant[];
}