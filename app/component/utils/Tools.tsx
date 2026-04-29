
import { ReactNode } from "react";
import { Eye, Scale, Calendar, TrendingUp, ChefHat } from "lucide-react";

export interface ToolItem {
  name: string;
  icon: ReactNode;
  description: string;
  comingSoon?: boolean;
  identity: string
}

export const TOOLS_ITEMS: ToolItem[] = [
  {
    name: "View Public Recipes",
    icon: <Eye className="h-8 w-8" />,
    description: "Explore thousands of recipes shared by the community.",
    identity: "PUBLIC"
  }
];