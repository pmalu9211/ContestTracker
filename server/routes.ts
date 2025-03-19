import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios from "axios";
import { addWeeks, addDays, setHours, setMinutes, format } from "date-fns";

// IST is UTC+5:30
const IST_OFFSET = 5.5 * 60 * 60 * 1000;

async function fetchCodeForcesContests() {
  try {
    const response = await axios.get("https://codeforces.com/api/contest.list");
    return response.data.result.map((contest: any) => ({
      name: contest.name,
      platform: "CODEFORCES",
      startTime: new Date(contest.startTimeSeconds * 1000),
      endTime: new Date((contest.startTimeSeconds + contest.durationSeconds) * 1000),
      url: `https://codeforces.com/contestRegistrants/${contest.id}`,
      status: contest.phase === "BEFORE" ? "UPCOMING" : 
              contest.phase === "CODING" ? "ONGOING" : "FINISHED"
    }));
  } catch (error) {
    console.error("Error fetching CodeForces contests:", error);
    throw new Error("Failed to fetch CodeForces contests");
  }
}

function adjustToIST(date: Date, hours: number, minutes: number = 0): Date {
  const utcDate = new Date(date);
  // Set to specified IST time
  utcDate.setUTCHours(hours - 5, minutes - 30); // Subtract IST offset to get UTC time
  return utcDate;
}

function generateUpcomingContests() {
  const now = new Date();
  const contests = [];

  // LeetCode Weekly Contest (Sunday 8:00 AM IST)
  const nextSunday = addDays(now, (7 - now.getDay()) % 7);
  const leetcodeWeekly = {
    name: `Weekly Contest ${Math.floor(format(now, 'w')) + 442}`,
    platform: "LEETCODE",
    startTime: adjustToIST(nextSunday, 8), // 8:00 AM IST
    endTime: adjustToIST(nextSunday, 10), // 10:00 AM IST
    url: `https://leetcode.com/contest/weekly-contest-${Math.floor(format(now, 'w')) + 442}`,
    status: "UPCOMING"
  };
  contests.push(leetcodeWeekly);

  // LeetCode Biweekly Contest (Saturday 8:00 PM IST, every other week)
  const nextSaturday = addDays(now, (6 - now.getDay() + 7) % 7);
  if (Math.floor(format(now, 'w')) % 2 === 0) {
    const leetcodeBiweekly = {
      name: `Biweekly Contest ${Math.floor(format(now, 'w') / 2) + 153}`,
      platform: "LEETCODE",
      startTime: adjustToIST(nextSaturday, 20), // 8:00 PM IST
      endTime: adjustToIST(nextSaturday, 22), // 10:00 PM IST
      url: `https://leetcode.com/contest/biweekly-contest-${Math.floor(format(now, 'w') / 2) + 153}`,
      status: "UPCOMING"
    };
    contests.push(leetcodeBiweekly);
  }

  // CodeChef Contest (Wednesday 8:00 PM IST)
  const nextWednesday = addDays(now, (3 - now.getDay() + 7) % 7);
  const codechefContest = {
    name: `START${format(now, 'w')}`,
    platform: "CODECHEF",
    startTime: adjustToIST(nextWednesday, 20), // 8:00 PM IST
    endTime: adjustToIST(nextWednesday, 23), // 11:00 PM IST
    url: `https://www.codechef.com/START${format(now, 'w')}`,
    status: "UPCOMING"
  };
  contests.push(codechefContest);

  return contests;
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/contests", async (_req, res) => {
    try {
      const codeforcesContests = await fetchCodeForcesContests();
      const upcomingContests = generateUpcomingContests();

      const allContests = [...codeforcesContests, ...upcomingContests]
        .filter(contest => {
          const contestDate = new Date(contest.startTime);
          const weekFromNow = addWeeks(new Date(), 1);
          return contestDate <= weekFromNow;
        });

      res.json(allContests);
    } catch (error) {
      console.error("Error fetching contests:", error);
      res.status(500).json({ message: "Failed to fetch contests" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}