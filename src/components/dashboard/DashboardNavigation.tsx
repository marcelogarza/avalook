import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Newspaper,
  Coins,
  Activity,
  Star,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";
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
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
            onClick={onClick}
          >
            <span className="text-xl">{icon}</span>
            <span>{label}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface DashboardNavigationProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
  collapsed?: boolean;
}

const DashboardNavigation = ({
  activeSection = "overview",
  onSectionChange = () => {},
  collapsed = false,
}: DashboardNavigationProps) => {
  const handleNavClick = (section: string) => {
    onSectionChange(section);
  };

  return (
    <div className="h-full w-[250px] bg-background border-r flex flex-col justify-between py-6">
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

      <div className="space-y-1 px-3 mt-auto">
        <NavItem
          icon={<Settings size={20} />}
          label="Settings"
          href="/settings"
          active={activeSection === "settings"}
          onClick={() => handleNavClick("settings")}
        />
        <NavItem
          icon={<HelpCircle size={20} />}
          label="Help"
          href="/help"
          active={activeSection === "help"}
          onClick={() => handleNavClick("help")}
        />
        <NavItem
          icon={<LogOut size={20} />}
          label="Logout"
          href="/logout"
          onClick={() => console.log("Logout clicked")}
        />
      </div>
    </div>
  );
};

export default DashboardNavigation;
