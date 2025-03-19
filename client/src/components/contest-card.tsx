import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Clock, Calendar } from "lucide-react";
import { type Contest } from "@shared/schema";
import { PLATFORM_COLORS, PLATFORM_ICONS } from "@/lib/constants";
import { formatContestTime, getContestDuration, generateGoogleCalendarUrl } from "@/lib/utils";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ContestCardProps {
  contest: Contest;
}

export function ContestCard({ contest }: ContestCardProps) {
  const PlatformIcon = PLATFORM_ICONS[contest.platform as keyof typeof PLATFORM_ICONS];

  return (
    <Card className="w-full h-full backdrop-blur-sm bg-background/95 border-primary/10 hover:border-primary/20 transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <PlatformIcon 
              className="h-5 w-5" 
              style={{ color: PLATFORM_COLORS[contest.platform as keyof typeof PLATFORM_COLORS] }}
            />
            <motion.div
              className="absolute -inset-1 rounded-full bg-primary/10"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.2, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          </div>
          <h3 className="font-semibold text-lg line-clamp-1">{contest.name}</h3>
        </div>
        <Badge 
          variant={contest.status === "UPCOMING" ? "outline" : 
                 contest.status === "ONGOING" ? "default" : "secondary"}
          className="animate-in fade-in duration-300"
        >
          {contest.status}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{formatContestTime(contest.startTime)}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Duration: {getContestDuration(contest.startTime, contest.endTime)}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1 group"
              onClick={() => window.open(contest.url, "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
              Join Contest
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => window.open(generateGoogleCalendarUrl(contest), "_blank")}
                  >
                    <Calendar className="h-4 w-4 hover:scale-110 transition-transform" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add to Google Calendar</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}