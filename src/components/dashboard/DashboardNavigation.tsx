import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { BarChart3, Newspaper, Coins, Activity, Star } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem = ({
  icon,
  label,
  href,
  active = false,
  onClick,
}: NavItemProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to={href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
              active
                ? "bg-primary/10 text-primary font-medium"
                : "text-base-content/70 hover:bg-base-200 hover:text-base-content"
            )}
            onClick={onClick}
          >
            <span className="text-xl">{icon}</span>
            <span>{label}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          className="bg-base-200 text-base-content border-base-300"
        >
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface DashboardNavigationProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
  collapsed?: boolean;
  className?: string;
}

const DashboardNavigation = ({
  activeSection = "overview",
  onSectionChange = () => {},
  collapsed = false,
  className = "",
}: DashboardNavigationProps) => {
  const handleNavClick = (section: string) => {
    onSectionChange(section);
  };

  return (
    <div
      className={`h-full w-[250px] bg-base-100 border-r-2 border-r-base-300 flex flex-col justify-between py-6 ${className}`}
    >
      <div className="space-y-1 px-3">
        <NavItem
          icon={<BarChart3 size={20} />}
          label="Charts"
          href="/charts"
          active={activeSection === "charts"}
          onClick={() => handleNavClick("charts")}
        />
        <NavItem
          icon={<Newspaper size={20} />}
          label="News"
          href="/news"
          active={activeSection === "news"}
          onClick={() => handleNavClick("news")}
        />
        <NavItem
          icon={<Coins size={20} />}
          label="Token Prices"
          href="/tokens"
          active={activeSection === "tokens"}
          onClick={() => handleNavClick("tokens")}
        />
        <NavItem
          icon={<Activity size={20} />}
          label="Network Status"
          href="/network"
          active={activeSection === "network"}
          onClick={() => handleNavClick("network")}
        />
        <NavItem
          icon={<Star size={20} />}
          label="Watchlist"
          href="/watchlist"
          active={activeSection === "watchlist"}
          onClick={() => handleNavClick("watchlist")}
        />
      </div>
    </div>
  );
};

export default DashboardNavigation;
