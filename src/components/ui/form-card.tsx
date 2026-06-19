import {
  Card,
  CardContent,
} from "@mui/material";

export function FormCard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Card
      elevation={0}
      sx={{
        maxWidth: 800,

        border: 1,
        borderColor: "divider",

        borderRadius: 3,
      }}
    >
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}