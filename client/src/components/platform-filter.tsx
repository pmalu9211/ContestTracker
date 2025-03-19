import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup } from "@/components/ui/toggle-group";
import { type Platform } from "@shared/schema";
import { PLATFORM_COLORS, PLATFORM_ICONS } from "@/lib/constants";

interface PlatformFilterProps {
  selectedPlatforms: Platform[];
  onPlatformChange: (platforms: Platform[]) => void;
}

export function PlatformFilter({ selectedPlatforms, onPlatformChange }: PlatformFilterProps) {
  const handleValueChange = (values: string[]) => {
    onPlatformChange(values as Platform[]);
  };

  return (
    <ToggleGroup 
      type="multiple"
      value={selectedPlatforms}
      onValueChange={handleValueChange}
      className="justify-start"
    >
      {Object.entries(PLATFORM_ICONS).map(([platform, Icon]) => (
        <Toggle
          key={platform}
          value={platform}
          variant="outline"
          className="data-[state=on]:bg-primary/10"
          aria-label={`Toggle ${platform}`}
        >
          <Icon 
            className="h-5 w-5 mr-2" 
            style={{ color: PLATFORM_COLORS[platform as Platform] }}
          />
          {platform}
        </Toggle>
      ))}
    </ToggleGroup>
  );
}
