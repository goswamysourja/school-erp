import {
  Card,
  CardContent,
} from "@mui/material";

export function DataCard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",

        border: 1,
        borderColor: "divider",

        borderRadius: 3,

        transition:
          "all 0.2s ease",

        "&:hover": {
          boxShadow: 3,
        },
      }}
    >
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}