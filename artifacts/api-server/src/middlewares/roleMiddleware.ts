import { type Request, type Response, type NextFunction } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import type { UserRole } from "@workspace/db";

export async function getUserRole(userId: string): Promise<UserRole> {
  const [row] = await db
    .select({ role: usersTable.role })
    .from(usersTable)
    .where(eq(usersTable.id, userId));
  return (row?.role as UserRole) ?? "member";
}

export function requireRole(...roles: UserRole[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }
    const role = await getUserRole(req.user.id);
    if (!roles.includes(role)) {
      res.status(403).json({ error: "Insufficient permissions" });
      return;
    }
    (req as Request & { userRole: UserRole }).userRole = role;
    next();
  };
}
