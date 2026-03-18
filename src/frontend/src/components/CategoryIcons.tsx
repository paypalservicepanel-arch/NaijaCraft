import {
  Camera,
  Car,
  ChefHat,
  Flame,
  Hammer,
  Paintbrush,
  Scissors,
  Sparkles,
  Star,
  Wind,
  Wrench,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  wrench: Wrench,
  zap: Zap,
  scissors: Scissors,
  hammer: Hammer,
  paintbrush: Paintbrush,
  flame: Flame,
  sparkles: Sparkles,
  star: Star,
  camera: Camera,
  "chef-hat": ChefHat,
  sparkle: Wind,
  "auto-repair": Car,
  car: Car,
};

export function CategoryIcon({
  name,
  className,
}: { name: string; className?: string }) {
  const Icon = ICON_MAP[name] || Wrench;
  return <Icon className={className} />;
}
