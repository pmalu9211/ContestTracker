import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Clock, Calendar } from "lucide-react";
import { type Contest } from "@shared/schema";
import { PLATFORM_COLORS, PLATFORM_ICONS } from "@/lib/constants";
import { formatContestTime, getContestDuration, generateGoogleCalendarUrl, getTimeUntilStart } from "@/lib/utils";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";

interface ContestCardProps {
  contest: Contest;
}

export function ContestCard({ contest }: ContestCardProps) {
  const PlatformIcon = PLATFORM_ICONS[contest.platform as keyof typeof PLATFORM_ICONS];
  const [timeLeft, setTimeLeft] = useState(getTimeUntilStart(contest.startTime));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilStart(contest.startTime));
    }, 1000);

    return () => clearInterval(timer);
  }, [contest.startTime]);

  return (
    <Card className="w-full h-full bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <PlatformIcon 
              className="h-5 w-5" 
              style={{ color: PLATFORM_COLORS[contest.platform as keyof typeof PLATFORM_COLORS] }}
            />
            <motion.div
              className="absolute -inset-1 rounded-full bg-gray-100"
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
          <h3 className="font-semibold text-lg line-clamp-1 text-gray-900">{contest.name}</h3>
        </div>
        <Badge 
          variant={contest.status === "UPCOMING" ? "outline" : 
                 contest.status === "ONGOING" ? "default" : "secondary"}
          className={`animate-in fade-in duration-300 ${
            contest.status === "UPCOMING" ? "border-blue-500 text-blue-700" :
            contest.status === "ONGOING" ? "bg-green-500" :
            "bg-gray-200 text-gray-700"
          }`}
        >
          {contest.status}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{formatContestTime(contest.startTime)}</span>
          </div>
          <div className="text-sm text-gray-600">
            Duration: {getContestDuration(contest.startTime, contest.endTime)}
          </div>
          <div className="text-sm font-medium text-blue-600">
            {timeLeft}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1 group border-gray-200 hover:border-gray-300 bg-white"
              onClick={() => window.open(contest.url, "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform text-gray-600" />
              Join Contest
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-gray-200 hover:border-gray-300 bg-white"
                    onClick={() => window.open(generateGoogleCalendarUrl(contest), "_blank")}
                  >
                    <Calendar className="h-4 w-4 hover:scale-110 transition-transform text-gray-600" />
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