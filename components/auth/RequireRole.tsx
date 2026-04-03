"use client";

import { useSession } from "next-auth/react";
import { UserRole } from "@prisma/client";

interface RequireRoleProps {
  children: React.ReactNode;
  roles: UserRole[];
  fallback?: React.ReactNode;
}

/**
 * Composant HOC pour restreindre l'affichage selon le rôle de l'utilisateur.
 * Exemple: <RequireRole roles={["DIRECTOR", "ADMIN"]}> ... </RequireRole>
 */
export function RequireRole({ children, roles, fallback = null }: RequireRoleProps) {
  const { data: session } = useSession();

  if (!session?.user?.role) {
    return fallback;
  }

  // Si le rôle de l'utilisateur est inclus dans la liste des rôles autorisés (OU s'il est SUPER_ADMIN)
  if (roles.includes(session.user.role) || session.user.role === "SUPER_ADMIN") {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
