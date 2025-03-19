import { SiLeetcode, SiCodechef, SiCodeforces } from "react-icons/si";
import { type Platform } from "@shared/schema";

export const PLATFORM_COLORS: Record<Platform, string> = {
  LEETCODE: "#FFA116",
  CODECHEF: "#5B4638",
  CODEFORCES: "#318CE7"
};

export const PLATFORM_ICONS: Record<Platform, React.ComponentType> = {
  LEETCODE: SiLeetcode,
  CODECHEF: SiCodechef,
  CODEFORCES: SiCodeforces
};
