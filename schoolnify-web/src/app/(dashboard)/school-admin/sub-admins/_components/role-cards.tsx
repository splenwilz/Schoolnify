"use client";

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  color: string;
}

interface SubAdmin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roleId: string;
  roleName: string;
  status: "active" | "invited" | "deactivated";
  invitedDate: string;
  lastActive?: string;
}

interface RoleCardsProps {
  roles: Role[];
  subAdmins: SubAdmin[];
}

export function RoleCards({ roles, subAdmins }: RoleCardsProps) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
      <h3 className="text-sm font-medium text-[var(--foreground)] mb-4">
        Roles
      </h3>
      <div className="space-y-4">
        {roles.map((role) => {
          const count = subAdmins.filter((sa) => sa.roleId === role.id).length;
          return (
            <div key={role.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: role.color }}
                  />
                  <span className="text-sm text-[var(--foreground)]">
                    {role.name}
                  </span>
                </div>
                <span className="text-sm font-medium text-[var(--foreground)] font-mono">
                  {count}
                </span>
              </div>
              <p className="text-xs text-[var(--muted)] pl-4">
                {role.description}
              </p>
              <p className="text-xs text-[var(--muted)] pl-4">
                {role.permissions.length} permissions
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
