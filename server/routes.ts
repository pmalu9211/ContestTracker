import type { Express } from "express";
import { createServer, type Server } from "http";
import axios from "axios";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/contests", async (_req, res) => {
    try {
      const response = await axios.get("https://competeapi.vercel.app/contests/upcoming");
      const contests = response.data.map((contest: any) => ({
        id: `${contest.site}-${contest.startTime}`,
        name: contest.title,
        platform: contest.site.toUpperCase(),
        startTime: new Date(contest.startTime),
        endTime: new Date(contest.endTime),
        url: contest.url,
        duration: contest.duration,
        status: determineContestStatus(contest.startTime, contest.endTime)
      }));

      res.json(contests);
    } catch (error) {
      console.error("Error fetching contests:", error);
      res.status(500).json({ message: "Failed to fetch contests" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function determineContestStatus(startTime: number, endTime: number): string {
  const now = Date.now();
  if (now < startTime) return "UPCOMING";
  if (now >= startTime && now <= endTime) return "ONGOING";
  return "FINISHED";
}