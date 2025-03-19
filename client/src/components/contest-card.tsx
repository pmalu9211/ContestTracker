import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Clock } from "lucide-react";
import { type Contest } from "@shared/schema";
import { PLATFORM_COLORS, PLATFORM_ICONS } from "@/lib/constants";
import { formatContestTime, getContestDuration } from "@/lib/utils";

interface ContestCardProps {
  contest: Contest;
}

export function ContestCard({ contest }: ContestCardProps) {
  const PlatformIcon = PLATFORM_ICONS[contest.platform as keyof typeof PLATFORM_ICONS];
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <PlatformIcon className="h-5 w-5" style={{ color: PLATFORM_COLORS[contest.platform as keyof typeof PLATFORM_COLORS] }} />
          <h3 className="font-semibold text-lg">{contest.name}</h3>
        </div>
        <Badge 
          variant={contest.status === "UPCOMING" ? "outline" : 
                 contest.status === "ONGOING" ? "default" : "secondary"}
        >
          {contest.status}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{formatContestTime(contest.startTime)}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Duration: {getContestDuration(contest.startTime, contest.endTime)}
          </div>
          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={() => window.open(contest.url, "_blank")}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Go to Contest
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
