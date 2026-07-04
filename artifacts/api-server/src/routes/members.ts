import { Router, type IRouter, type Request, type Response } from "express";
import { db, certificatesTable, userCoursesTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { GetMyProfileResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/me/profile", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, req.user.id));

  if (!user) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const enrolledCourses = await db
    .select()
    .from(userCoursesTable)
    .where(eq(userCoursesTable.userId, req.user.id));

  const certificates = await db
    .select()
    .from(certificatesTable)
    .where(eq(certificatesTable.userId, req.user.id));

  const certifiedSlugs = new Set(certificates.map((c) => c.courseSlug));

  const data = GetMyProfileResponse.parse({
    role: user.role,
    joinedAt: user.createdAt.toISOString(),
    courses: enrolledCourses.map((c) => ({
      courseSlug: c.courseSlug,
      progress: c.progress,
      completed: c.completed,
      certificateIssued: certifiedSlugs.has(c.courseSlug),
      enrolledAt: c.enrolledAt.toISOString(),
    })),
    certificates: certificates.map((c) => ({
      id: c.id,
      courseSlug: c.courseSlug,
      issuedAt: c.issuedAt.toISOString(),
    })),
  });

  res.json(data);
});

export default router;
