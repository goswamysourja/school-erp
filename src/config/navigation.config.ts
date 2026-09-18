import { Role } from "@prisma/client";

import DashboardIcon from "@mui/icons-material/Dashboard";
import ApartmentIcon from "@mui/icons-material/Apartment";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AssignmentIcon from "@mui/icons-material/Assignment";
import type { SvgIconComponent } from "@mui/icons-material";

export interface NavigationItem {
  label: string;
  href: string;
  icon: SvgIconComponent;
  roles: Role[];
}

export const navigationItems: NavigationItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: DashboardIcon,
    roles: [
      Role.SUPER_ADMIN,
      Role.ADMIN,
      Role.TEACHER,
    ],
  },

  {
  label: "My Classes",
  href: "/dashboard/my-classes",
  icon: SchoolIcon,
  roles: [
    Role.TEACHER,
  ],
},

{
  label: "My Students",
  href: "/dashboard/my-students",
  icon: PeopleIcon,
  roles: [
    Role.TEACHER,
  ],
},

{
  label: "My Subjects",
  href: "/dashboard/my-subjects",
  icon: MenuBookIcon,
  roles: [
    Role.TEACHER,
  ],
},

  {
    label: "Tenants",
    href: "/dashboard/tenants",
    icon: ApartmentIcon,
    roles: [
      Role.SUPER_ADMIN,
    ],
  },

  {
    label: "Users",
    href: "/dashboard/users",
    icon: PeopleIcon,
    roles: [
      Role.ADMIN,
    ],
  },

  {
    label: "Classes",
    href: "/dashboard/classes",
    icon: SchoolIcon,
    roles: [
      Role.ADMIN,
    ],
  },

  {
    label: "Sections",
    href: "/dashboard/sections",
    icon: SchoolIcon,
    roles: [
      Role.ADMIN,
    ],
  },

  {
    label: "Students",
    href: "/dashboard/students",
    icon: PeopleIcon,
    roles: [
      Role.ADMIN,
    ],
  },

  {
    label: "Teachers",
    href: "/dashboard/teachers",
    icon: PersonIcon,
    roles: [
      Role.ADMIN,
    ],
  },

 {
  label: "Subjects",
  href: "/dashboard/subjects",
  icon: MenuBookIcon,
  roles: [
    Role.ADMIN,
  ],
},

{
  label: "Teaching Assignments",
  href: "/dashboard/teaching-assignment",
  icon: AssignmentIcon,
  roles: [
    Role.ADMIN,
  ],
},

{
  label: "Class Teachers",
  href: "/dashboard/class-teacher-assignment",
  icon: AssignmentIcon,
  roles: [
    Role.ADMIN,
  ],
},


];