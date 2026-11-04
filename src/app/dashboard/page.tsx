import { Box } from "@mui/material";
import { Role } from "@prisma/client";

import { requireAuth } from "@/modules/auth/guards/require-auth.guard";

import {
  getAdminDashboardStats,
  getSuperAdminDashboardStats,
  getTeacherDashboardStats,
} from "@/modules/dashboard/services/get-dashboard-stats.service.ts";

import { PageHeader } from "@/components/ui/page-header";
import { SectionContainer } from "@/components/ui/section-container";
import { StatCard } from "@/components/dashboard/stat-card";
import { WelcomeCard } from "@/components/dashboard/welcome-card";

export default async function DashboardPage() {
  const user = await requireAuth();

  if (user.role === Role.SUPER_ADMIN) {
    const stats = await getSuperAdminDashboardStats();

    return (
      <>
        <PageHeader
          title="Dashboard"
          subtitle="Platform Overview"
        />

        <Box sx={{ mb: 4 }}>
          <WelcomeCard
            name={user.name}
            role={user.role}
          />
        </Box>

        <SectionContainer>
          <StatCard
            title="Total Tenants"
            value={stats.totalTenants}
          />

          <StatCard
            title="Pending Tenants"
            value={stats.pendingTenants}
          />

          <StatCard
            title="Active Tenants"
            value={stats.activeTenants}
          />

          <StatCard
            title="Suspended Tenants"
            value={stats.suspendedTenants}
          />
        </SectionContainer>
      </>
    );
  }

  if (user.role === Role.ADMIN) {
    if (!user.tenantId) {
      throw new Error("Tenant assignment missing.");
    }

    const stats = await getAdminDashboardStats(
      user.tenantId
    );

    return (
      <>
        <PageHeader
          title="Dashboard"
          subtitle="School Overview"
        />

        <Box sx={{ mb: 4 }}>
          <WelcomeCard
            name={user.name}
            role={user.role}
          />
        </Box>

        <SectionContainer>
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
          />

          <StatCard
            title="Total Teachers"
            value={stats.totalTeachers}
          />

          <StatCard
            title="Total Classes"
            value={stats.totalClasses}
          />

          <StatCard
            title="Total Sections"
            value={stats.totalSections}
          />

          <StatCard
            title="Total Subjects"
            value={stats.totalSubjects}
          />
        </SectionContainer>
      </>
    );
  }

  if (user.role === Role.TEACHER) {
    const stats = await getTeacherDashboardStats(
      user.id
    );

    return (
      <>
        <PageHeader
          title="Dashboard"
          subtitle="Teacher Overview"
        />

        <Box sx={{ mb: 4 }}>
          <WelcomeCard
            name={user.name}
            role={user.role}
          />
        </Box>

        <SectionContainer>
          <StatCard
            title="Assigned Sections"
            value={stats.assignedSections}
          />

          <StatCard
            title="Subjects Taught"
            value={stats.subjectsTaught}
          />

          <StatCard
            title="Class Teacher Sections"
            value={stats.classTeacherSections}
          />

          <StatCard
            title="Students in Assigned Sections"
            value={stats.totalStudents}
          />
        </SectionContainer>
      </>
    );
  }

  return null;
}