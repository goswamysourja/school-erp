import type {
  User,
} from "@prisma/client";

interface Props {
  user: User & {
    tenant: {
      name: string;
    } | null;
  };
}

export function UserCard({
  user,
}: Props) {
  return (
    <div>
      <h3>
        {user.name}
      </h3>

      <p>
        {user.email}
      </p>

      <p>
        {user.role}
      </p>

      <p>
        {user.tenant?.name ??
          "No Tenant"}
      </p>

      <p>
        {user.isActive
          ? "Active"
          : "Inactive"}
      </p>
    </div>
  );
}