import {
  Box,
} from "@mui/material";

import { getAuthUser }
  from "@/modules/auth/services/get-auth-user.service";

import { getDashboardStats }
  from "@/modules/dashboard/services/get-dashboard-stats.service";

import { PageHeader }
  from "@/components/ui/page-header";

import { SectionContainer }
  from "@/components/ui/section-container";

import { StatCard }
  from "@/components/dashboard/stat-card";

import { QuickActions }
  from "@/components/dashboard/quick-actions";

import { WelcomeCard }
  from "@/components/dashboard/welcome-card";

export default async function DashboardPage() {
  const user =
    await getAuthUser();

  const stats =
    await getDashboardStats();

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="School ERP Overview"
      />

      <Box
        sx={{
          mb: 4,
        }}
      >
        <WelcomeCard
          name={user?.name ?? ""}
          role={user?.role ?? ""}
        />
      </Box>

      <SectionContainer>
        <StatCard
          title="Users"
          value={stats.users}
        />

        <StatCard
          title="Tenants"
          value={stats.tenants}
        />

        <StatCard
          title="Classes"
          value={stats.classes}
        />
      </SectionContainer>

      <Box
        sx={{
          mt: 5,
        }}
      >
        <PageHeader
          title="Quick Actions"
          subtitle="Frequently used actions"
        />

        <QuickActions />
      </Box>
    </>
  );
}