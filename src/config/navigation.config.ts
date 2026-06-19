import DashboardIcon
  from "@mui/icons-material/Dashboard";

import ApartmentIcon
  from "@mui/icons-material/Apartment";

import PeopleIcon
  from "@mui/icons-material/People";

import SchoolIcon
  from "@mui/icons-material/School";

export const navigationItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: DashboardIcon,
  },

  {
    label: "Tenants",
    href: "/dashboard/tenants",
    icon: ApartmentIcon,
  },

  {
    label: "Users",
    href: "/dashboard/users",
    icon: PeopleIcon,
  },

  {
    label: "Classes",
    href: "/dashboard/classes",
    icon: SchoolIcon,
  },
];