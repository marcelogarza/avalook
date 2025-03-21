import React from "react";
import {
  Search,
  Bell,
  Settings,
  User,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useWeb3Modal } from "@web3modal/ethers5/react";

interface DashboardHeaderProps {
  onSettingsClick?: () => void;
  username?: string;
  avatarUrl?: string;
}

const DashboardHeader = ({
  onSettingsClick = () => {},
  username = "John Doe",
  avatarUrl = "",
}: DashboardHeaderProps) => {
  const { open } = useWeb3Modal();

  const handleManageWallet = () => {
    open();
  };

  return (
    <header className="flex items-center justify-between h-20 px-6 border-b border-base-300 bg-base-100">
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <img
            src="https://cryptologos.cc/logos/avalanche-avax-logo.png"
            alt="Avalanche Logo"
            className="h-8 w-8 mr-2"
          />
          <h1 className="text-xl font-bold text-base-content">AvaLook</h1>
        </div>
      </div>

      <div className="relative w-96">
        <Input
          type="text"
          placeholder="Search dashboards, tokens, news..."
          className="pl-10 pr-4 py-2 w-full bg-base-200 border-base-300 text-base-content"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-base-content/70" />
      </div>

      <div className="flex items-center space-x-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-base-content hover:bg-base-200"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-error rounded-full"></span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-base-200 text-base-content border-base-300">
              <p>Notifications</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onSettingsClick}
                className="text-base-content hover:bg-base-200"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-base-200 text-base-content border-base-300">
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center space-x-2 text-base-content hover:bg-base-200"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={avatarUrl} alt={username} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {username
                    .split(" ")
                    .map((name) => name[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium hidden md:inline-block">
                {username}
              </span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-base-100 border-base-300 text-base-content"
          >
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-base-300" />
            <DropdownMenuItem className="hover:bg-base-200 focus:bg-base-200">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onSettingsClick}
              className="hover:bg-base-200 focus:bg-base-200"
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-base-300" />
            <DropdownMenuItem
              onClick={handleManageWallet}
              className="hover:bg-base-200 focus:bg-base-200"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Manage Wallet</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;
