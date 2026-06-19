import Chip from "@mui/material/Chip";

interface Props {
  active: boolean;
}

export function StatusChip({
  active,
}: Props) {
  return (
    <Chip
      label={
        active
          ? "Active"
          : "Inactive"
      }
      color={
        active
          ? "success"
          : "error"
      }
      variant="outlined"
      size="small"
    />
  );
}