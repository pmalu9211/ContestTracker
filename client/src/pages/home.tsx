import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Contest, Platform, ContestStatus } from "@shared/schema";
import { ContestCard } from "@/components/contest-card";
import { PlatformFilter } from "@/components/platform-filter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sun, Moon } from "lucide-react";
import { sortContests } from "@/lib/utils";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Home() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(["LEETCODE", "CODECHEF", "CODEFORCES"]);
  const [statusFilter, setStatusFilter] = useState<ContestStatus | "ALL">("ALL");
  const [sortBy, setSortBy] = useState<string>("time");
  const [isDark, setIsDark] = useState(false);

  const { data: contests, isLoading } = useQuery<Contest[]>({
    queryKey: ["/api/contests"],
  });

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const filteredContests = contests
    ? sortContests(
        contests.filter(contest => 
          (selectedPlatforms.includes(contest.platform as Platform)) &&
          (statusFilter === "ALL" || contest.status === statusFilter)
        ),
        sortBy
      )
    : [];

  return (
    <div className={`min-h-screen bg-background transition-colors duration-300 ${isDark ? 'dark' : ''}`}>
      <div className="container mx-auto p-4 space-y-8">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-700 dark:from-emerald-400 dark:to-emerald-600 bg-clip-text text-transparent">
              Competitive Programming Contests
            </h1>
            <p className="text-muted-foreground">
              Track upcoming programming contests across multiple platforms
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full border-2 border-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <PlatformFilter
              selectedPlatforms={selectedPlatforms}
              onPlatformChange={setSelectedPlatforms}
            />

            <div className="flex gap-2 w-full sm:w-auto">
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as ContestStatus | "ALL")}
              >
                <SelectTrigger className="w-[140px] bg-white dark:bg-gray-900 border-2 border-emerald-500/20">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Contests</SelectItem>
                  <SelectItem value="UPCOMING">Upcoming</SelectItem>
                  <SelectItem value="ONGOING">Ongoing</SelectItem>
                  <SelectItem value="FINISHED">Finished</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={sortBy}
                onValueChange={setSortBy}
              >
                <SelectTrigger className="w-[140px] bg-white dark:bg-gray-900 border-2 border-emerald-500/20">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="time">Start Time</SelectItem>
                  <SelectItem value="platform">Platform</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {isLoading ? (
              Array(6).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-[200px] w-full" />
              ))
            ) : filteredContests.length === 0 ? (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No contests found matching your filters
              </div>
            ) : (
              filteredContests.map((contest) => (
                <motion.div key={contest.id} variants={item}>
                  <ContestCard contest={contest} />
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}