import {
  Box,
  Button,
  Stack,
} from "@mui/material";

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
    const stats =
      await getSuperAdminDashboardStats();

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

        <Box sx={{ mt: 5 }}>
          <PageHeader
            title="Quick Actions"
            subtitle="Manage your school platform"
          />

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={2}
            sx={{ mt: 2 }}
          >
            <Button
              variant="contained"
              href="/dashboard/tenants"
            >
              Manage Tenants
            </Button>

            <Button
              variant="outlined"
              href="/dashboard/tenants/create"
            >
              Create Tenant
            </Button>
          </Stack>
        </Box>
      </>
    );
  }

  if (user.role === Role.ADMIN) {
    if (!user.tenantId) {
      throw new Error(
        "Tenant assignment missing.",
      );
    }

    const stats =
      await getAdminDashboardStats(
        user.tenantId,
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

        <Box sx={{ mt: 5 }}>
          <PageHeader
            title="Quick Actions"
            subtitle="Manage your school"
          />

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={2}
            sx={{ mt: 2 }}
          >
            <Button
              variant="contained"
              href="/dashboard/users/create"
            >
              Create User
            </Button>

            <Button
              variant="outlined"
              href="/dashboard/classes/create"
            >
              Create Class
            </Button>

            <Button
              variant="outlined"
              href="/dashboard/students/create"
            >
              Create Student
            </Button>

            <Button
              variant="outlined"
              href="/dashboard/subjects/create"
            >
              Create Subject
            </Button>
          </Stack>
        </Box>
      </>
    );
  }

  if (user.role === Role.TEACHER) {
    const stats =
      await getTeacherDashboardStats(
        user.id,
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
            value={
              stats.classTeacherSections
            }
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