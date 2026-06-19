"use client";

import { IconButton } from "@mui/material";

import MenuIcon
  from "@mui/icons-material/Menu";

interface Props {
  onClick: () => void;
}

export function MobileMenuButton({
  onClick,
}: Props) {
  return (
    <IconButton
      onClick={onClick}
    >
      <MenuIcon />
    </IconButton>
  );
}