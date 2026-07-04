import { Router, type IRouter, type Request, type Response } from "express";
import { db, teamAssignmentsTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import { ListTeamAssignmentsResponse } from "@workspace/api-zod";
import { requireRole } from "../middlewares/roleMiddleware";

const router: IRouter = Router();

router.get(
  "/team/assignments",
  requireRole("gcl_team", "admin"),
  async (_req: Request, res: Response) => {
    const assignments = await db
      .select()
      .from(teamAssignmentsTable)
      .orderBy(desc(teamAssignmentsTable.dueDate));

    const data = ListTeamAssignmentsResponse.parse({
      assignments: assignments.map((a) => ({
        id: a.id,
        title: a.title,
        description: a.description,
        dueDate: a.dueDate.toISOString(),
        status: a.status,
      })),
    });

    res.json(data);
  },
);

export default router;
