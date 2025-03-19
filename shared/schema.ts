import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const contests = pgTable("contests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  platform: text("platform").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  url: text("url").notNull(),
  status: text("status").notNull(), // UPCOMING, ONGOING, FINISHED
  duration: text("duration").notNull() // Added duration field
});

export const insertContestSchema = createInsertSchema(contests).omit({ id: true });

export interface Contest {
  id: string;
  name: string;
  platform: Platform;
  startTime: Date;
  endTime: Date;
  url: string;
  duration: number;
  status: ContestStatus;
}

export type InsertContest = z.infer<typeof insertContestSchema>;

export const platformEnum = z.enum(["LEETCODE", "CODECHEF", "CODEFORCES"]);
export type Platform = z.infer<typeof platformEnum>;

export const contestStatusEnum = z.enum(["UPCOMING", "ONGOING", "FINISHED"]);
export type ContestStatus = z.infer<typeof contestStatusEnum>;