import { Router, type IRouter, type Request, type Response } from "express";
import { db, userRoles, usersTable, type UserRole } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  ListAllUsersResponse,
  UpdateUserRoleResponse,
  UpdateUserRoleBody,
} from "@workspace/api-zod";
import { requireRole } from "../middlewares/roleMiddleware";

const router: IRouter = Router();

router.get(
  "/admin/users",
  requireRole("admin"),
  async (_req: Request, res: Response) => {
    const users = await db.select().from(usersTable);

    const data = ListAllUsersResponse.parse({
      users: users.map((u) => ({
        id: u.id,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        role: u.role,
        createdAt: u.createdAt.toISOString(),
      })),
    });

    res.json(data);
  },
);

router.patch(
  "/admin/users/:userId/role",
  requireRole("admin"),
  async (req: Request, res: Response) => {
    const parsed = UpdateUserRoleBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid role" });
      return;
    }

    const role = parsed.data.role as UserRole;
    if (!userRoles.includes(role)) {
      res.status(400).json({ error: "Invalid role" });
      return;
    }

    const [updated] = await db
      .update(usersTable)
      .set({ role })
      .where(eq(usersTable.id, req.params.userId))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const data = UpdateUserRoleResponse.parse({
      user: {
        id: updated.id,
        email: updated.email,
        firstName: updated.firstName,
        lastName: updated.lastName,
        role: updated.role,
        createdAt: updated.createdAt.toISOString(),
      },
    });

    res.json(data);
  },
);

export default router;
