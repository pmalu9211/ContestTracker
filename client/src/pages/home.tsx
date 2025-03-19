import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Contest, Platform, ContestStatus } from "@shared/schema";
import { ContestCard } from "@/components/contest-card";
import { PlatformFilter } from "@/components/platform-filter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(["LEETCODE", "CODECHEF", "CODEFORCES"]);
  const [statusFilter, setStatusFilter] = useState<ContestStatus | "ALL">("ALL");

  const { data: contests, isLoading } = useQuery<Contest[]>({
    queryKey: ["/api/contests"],
  });

  const filteredContests = contests?.filter(contest => 
    (selectedPlatforms.includes(contest.platform as Platform)) &&
    (statusFilter === "ALL" || contest.status === statusFilter)
  );

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Upcoming Contests</h1>
        <p className="text-muted-foreground">
          Track upcoming programming contests across multiple platforms
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <PlatformFilter
            selectedPlatforms={selectedPlatforms}
            onPlatformChange={setSelectedPlatforms}
          />
          
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as ContestStatus | "ALL")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Contests</SelectItem>
              <SelectItem value="UPCOMING">Upcoming</SelectItem>
              <SelectItem value="ONGOING">Ongoing</SelectItem>
              <SelectItem value="FINISHED">Finished</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-[200px] w-full" />
            ))
          ) : filteredContests?.length === 0 ? (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No contests found matching your filters
            </div>
          ) : (
            filteredContests?.map((contest) => (
              <ContestCard key={`${contest.platform}-${contest.name}`} contest={contest} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
