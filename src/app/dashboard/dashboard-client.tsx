
"use client";

import type { ReactNode } from "react";

import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";

// Icons
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SchoolIcon from "@mui/icons-material/School";
import ClassIcon from "@mui/icons-material/Class";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddHomeWorkIcon from "@mui/icons-material/AddHomeWork";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import GroupAddIcon from "@mui/icons-material/GroupAdd";

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalSections: number;
  totalSubjects: number;
}

interface DashboardClientProps {
  stats: DashboardStats;
}

interface KPIWidgetProps {
  title: string;
  value: number;
  icon: ReactNode;
  color: string;
  bgcolor: string;
}

interface ActionCardProps {
  title: string;
  icon: ReactNode;
  href: string;
}

export function DashboardClient({ stats }: DashboardClientProps) {
  return (
    <Stack spacing={4} sx={{ pb: 4, minWidth: 0 }}>
      {/* Header */}
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          Dashboard Overview
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.5 }}
        >
          High-level metrics and quick actions for your institution.
        </Typography>
      </Box>

      {/* KPI Grid */}
      <Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 2,
          }}
        >
          Institution Metrics
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              md: "repeat(3, minmax(0, 1fr))",
              lg: "repeat(5, minmax(0, 1fr))",
            },
            gap: 2,
          }}
        >
          <KPIWidget
            title="Total Students"
            value={stats.totalStudents}
            icon={<PeopleAltIcon />}
            color="primary.main"
            bgcolor="primary.50"
          />

          <KPIWidget
            title="Total Teachers"
            value={stats.totalTeachers}
            icon={<SchoolIcon />}
            color="info.main"
            bgcolor="info.50"
          />

          <KPIWidget
            title="Total Classes"
            value={stats.totalClasses}
            icon={<ClassIcon />}
            color="success.main"
            bgcolor="success.50"
          />

          <KPIWidget
            title="Total Sections"
            value={stats.totalSections}
            icon={<ViewModuleIcon />}
            color="warning.main"
            bgcolor="warning.50"
          />

          <KPIWidget
            title="Total Subjects"
            value={stats.totalSubjects}
            icon={<MenuBookIcon />}
            color="secondary.main"
            bgcolor="secondary.50"
          />
        </Box>
      </Box>

      {/* Quick Actions Grid */}
      <Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 2,
          }}
        >
          Quick Actions
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, minmax(0, 1fr))",
              sm: "repeat(3, minmax(0, 1fr))",
              md: "repeat(4, minmax(0, 1fr))",
            },
            gap: 2,
          }}
        >
          <ActionCard
            title="Create User"
            icon={<PersonAddIcon />}
            href="/dashboard/users/create"
          />

          <ActionCard
            title="Create Class"
            icon={<AddHomeWorkIcon />}
            href="/dashboard/classes/create"
          />

          <ActionCard
            title="Create Student"
            icon={<GroupAddIcon />}
            href="/dashboard/students/create"
          />

          <ActionCard
            title="Create Subject"
            icon={<LibraryBooksIcon />}
            href="/dashboard/subjects/create"
          />
        </Box>
      </Box>
    </Stack>
  );
}

// --- Reusable Subcomponents ---

function KPIWidget({
  title,
  value,
  icon,
  color,
  bgcolor,
}: KPIWidgetProps) {
  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
      }}
    >
      <CardContent
        sx={{
          p: 2.5,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Avatar
          sx={{
            bgcolor,
            color,
            width: 48,
            height: 48,
          }}
        >
          {icon}
        </Avatar>

        <Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            {title}
          </Typography>

          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              mt: 0.5,
              color: "text.primary",
            }}
          >
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

function ActionCard({
  title,
  icon,
  href,
}: ActionCardProps) {
  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          borderColor: "primary.main",
          transform: "translateY(-2px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        },
      }}
    >
      <CardActionArea
        href={href}
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            color: "primary.main",
            display: "flex",
            "& svg": {
              fontSize: 32,
            },
          }}
        >
          {icon}
        </Box>

        <Typography
          variant="body2"
          color="text.primary"
          sx={{
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          {title}
        </Typography>
      </CardActionArea>
    </Card>
  );
}
