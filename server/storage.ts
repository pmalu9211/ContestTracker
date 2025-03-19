import { type Contest, type InsertContest } from "@shared/schema";
import { type ContestStatus, type Platform } from "@shared/schema";

export interface IStorage {
  getContests(): Promise<Contest[]>;
  getContestsByPlatform(platform: Platform): Promise<Contest[]>;
  getContestsByStatus(status: ContestStatus): Promise<Contest[]>;
  upsertContest(contest: InsertContest): Promise<Contest>;
}

export class MemStorage implements IStorage {
  private contests: Map<number, Contest>;
  private currentId: number;

  constructor() {
    this.contests = new Map();
    this.currentId = 1;
  }

  async getContests(): Promise<Contest[]> {
    return Array.from(this.contests.values());
  }

  async getContestsByPlatform(platform: Platform): Promise<Contest[]> {
    return Array.from(this.contests.values()).filter(
      (contest) => contest.platform === platform
    );
  }

  async getContestsByStatus(status: ContestStatus): Promise<Contest[]> {
    return Array.from(this.contests.values()).filter(
      (contest) => contest.status === status
    );
  }

  async upsertContest(contest: InsertContest): Promise<Contest> {
    const id = this.currentId++;
    const newContest: Contest = { ...contest, id };
    this.contests.set(id, newContest);
    return newContest;
  }
}

export const storage = new MemStorage();
