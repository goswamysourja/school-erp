import {
  Role,
  StaffDesignation,
} from "@prisma/client";

import DashboardIcon from "@mui/icons-material/Dashboard";
import ApartmentIcon from "@mui/icons-material/Apartment";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CardMembershipIcon from "@mui/icons-material/CardMembership";

import type { SvgIconComponent } from "@mui/icons-material";

export interface NavigationItem {
  label: string;
  href: string;
  icon: SvgIconComponent;
  roles: Role[];
  designations?: StaffDesignation[];
  requiresLibraryAccess?: boolean;
}

export const navigationItems: NavigationItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: DashboardIcon,
    roles: [
      Role.SUPER_ADMIN,
      Role.ADMIN,
      Role.STAFF,
      Role.TEACHER,
    ],
  },
  {
    label: "My Classes",
    href: "/dashboard/my-classes",
    icon: SchoolIcon,
    roles: [Role.STAFF, Role.TEACHER],
    designations: [StaffDesignation.TEACHER],
  },
  {
    label: "My Students",
    href: "/dashboard/my-students",
    icon: PeopleIcon,
    roles: [Role.STAFF, Role.TEACHER],
    designations: [StaffDesignation.TEACHER],
  },
  {
    label: "My Subjects",
    href: "/dashboard/my-subjects",
    icon: MenuBookIcon,
    roles: [Role.STAFF, Role.TEACHER],
    designations: [StaffDesignation.TEACHER],
  },
  {
    label: "Tenants",
    href: "/dashboard/tenants",
    icon: ApartmentIcon,
    roles: [Role.SUPER_ADMIN],
  },
  {
    label: "Staff",
    href: "/dashboard/users",
    icon: PeopleIcon,
    roles: [Role.ADMIN],
  },
  {
    label: "Classes",
    href: "/dashboard/classes",
    icon: SchoolIcon,
    roles: [Role.ADMIN],
  },
  {
    label: "Sections",
    href: "/dashboard/sections",
    icon: SchoolIcon,
    roles: [Role.ADMIN],
  },
  {
    label: "Students",
    href: "/dashboard/students",
    icon: PeopleIcon,
    roles: [Role.ADMIN],
  },
  {
    label: "Teachers",
    href: "/dashboard/teachers",
    icon: PersonIcon,
    roles: [Role.ADMIN],
  },
  {
    label: "Subjects",
    href: "/dashboard/subjects",
    icon: MenuBookIcon,
    roles: [Role.ADMIN],
  },
  {
    label: "Teaching Assignments",
    href: "/dashboard/teaching-assignment",
    icon: AssignmentIcon,
    roles: [Role.ADMIN],
  },
  {
    label: "Class Teachers",
    href: "/dashboard/class-teacher-assignment",
    icon: AssignmentIcon,
    roles: [Role.ADMIN],
  },
  {
    label: "Academic Years",
    href: "/dashboard/academic-years",
    icon: CalendarMonthOutlinedIcon,
    roles: [Role.ADMIN],
  },
  {
    label: "Marks",
    href: "/dashboard/marks",
    icon: AssignmentIcon,
    roles: [Role.ADMIN, Role.STAFF, Role.TEACHER],
    designations: [StaffDesignation.TEACHER],
  },
  {
    label: "Certificates",
    href: "/dashboard/certificates",
    icon: CardMembershipIcon,
    roles: [Role.ADMIN],
  },
  {
    label: "Library",
    href: "/dashboard/library",
    icon: LibraryBooksIcon,
    roles: [Role.ADMIN, Role.STAFF, Role.TEACHER],
    requiresLibraryAccess: true,
  },
];