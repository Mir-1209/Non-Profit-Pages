import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessionsTable = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const userRoles = ["member", "gcl_team", "admin"] as const;
export type UserRole = (typeof userRoles)[number];

// (IMPORTANT) The core columns of this table are mandatory for Replit Auth, don't drop them.
export const usersTable = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role", { enum: userRoles }).notNull().default("member"),
  university: varchar("university"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export type UpsertUser = typeof usersTable.$inferInsert;
export type User = typeof usersTable.$inferSelect;

export const userCoursesTable = pgTable("user_courses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  courseSlug: varchar("course_slug").notNull(),
  progress: integer("progress").notNull().default(0),
  completed: boolean("completed").notNull().default(false),
  enrolledAt: timestamp("enrolled_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export type UserCourse = typeof userCoursesTable.$inferSelect;
export type InsertUserCourse = typeof userCoursesTable.$inferInsert;

export const certificatesTable = pgTable("certificates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  courseSlug: varchar("course_slug").notNull(),
  issuedAt: timestamp("issued_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Certificate = typeof certificatesTable.$inferSelect;
export type InsertCertificate = typeof certificatesTable.$inferInsert;

export const assignmentStatuses = ["upcoming", "in_progress", "completed"] as const;
export type AssignmentStatus = (typeof assignmentStatuses)[number];

export const teamAssignmentsTable = pgTable("team_assignments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  dueDate: timestamp("due_date", { withTimezone: true }).notNull(),
  status: varchar("status", { enum: assignmentStatuses }).notNull().default("upcoming"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type TeamAssignment = typeof teamAssignmentsTable.$inferSelect;
export type InsertTeamAssignment = typeof teamAssignmentsTable.$inferInsert;
