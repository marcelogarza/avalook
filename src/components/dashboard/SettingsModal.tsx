import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  Moon,
  Sun,
  Layout,
  Eye,
  Palette,
  Globe,
  Shield,
} from "lucide-react";
import { getCurrentTheme, setTheme } from "@/lib/theme";

interface SettingsModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const SettingsModal = ({ open = true, onOpenChange }: SettingsModalProps) => {
  const [activeTab, setActiveTab] = useState("appearance");
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if current theme is dark
    setIsDarkMode(getCurrentTheme() === "dark");
  }, []);

  // Handle theme toggle
  const toggleTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTheme = event.target.checked ? "dark" : "light";
    setTheme(newTheme);
    setIsDarkMode(newTheme === "dark");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-base-100 text-base-content max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Dashboard Settings
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 gap-2 mb-6">
              <TabsTrigger
                value="appearance"
                className="flex items-center gap-2"
              >
                <Palette size={16} />
                <span>Appearance</span>
              </TabsTrigger>
              <TabsTrigger value="layout" className="flex items-center gap-2">
                <Layout size={16} />
                <span>Layout</span>
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="flex items-center gap-2"
              >
                <Bell size={16} />
                <span>Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Shield size={16} />
                <span>Privacy</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="appearance" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Theme</h3>
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <Sun size={18} className="text-yellow-500" />
                    <span>Light Mode</span>
                  </div>
                  <Switch
                    checked={isDarkMode}
                    onCheckedChange={(checked) => {
                      const newTheme = checked ? "dark" : "light";
                      setTheme(newTheme);
                      setIsDarkMode(newTheme === "dark");
                    }}
                    className="data-[state=checked]:bg-primary"
                  />
                  <div className="flex items-center gap-2">
                    <Moon size={18} className="text-blue-500" />
                    <span>Dark Mode</span>
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-2">Color Scheme</h3>
                  <Select defaultValue="default">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select color scheme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="avalanche">Avalanche</SelectItem>
                      <SelectItem value="high-contrast">
                        High Contrast
                      </SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-2">Font Size</h3>
                  <Select defaultValue="medium">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select font size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="layout" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Dashboard Layout</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-md p-4 flex flex-col items-center cursor-pointer hover:border-primary">
                    <div className="w-full h-32 bg-muted rounded-md mb-2 flex items-center justify-center">
                      <Eye size={24} className="text-muted-foreground" />
                    </div>
                    <span>Default</span>
                  </div>
                  <div className="border rounded-md p-4 flex flex-col items-center cursor-pointer hover:border-primary">
                    <div className="w-full h-32 bg-muted rounded-md mb-2 flex items-center justify-center">
                      <Eye size={24} className="text-muted-foreground" />
                    </div>
                    <span>Compact</span>
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-2">Default Section</h3>
                  <Select defaultValue="overview">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select default section" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="overview">Overview</SelectItem>
                      <SelectItem value="charts">Charts</SelectItem>
                      <SelectItem value="news">News Feed</SelectItem>
                      <SelectItem value="tokens">Token Prices</SelectItem>
                      <SelectItem value="watchlist">Watchlist</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Show News Feed</span>
                    <Switch id="show-news" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Show Token Prices</span>
                    <Switch id="show-tokens" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Show Watchlist</span>
                    <Switch id="show-watchlist" defaultChecked />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  Notification Preferences
                </h3>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Price Alerts</span>
                    <Switch id="price-alerts" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Network Status Changes</span>
                    <Switch id="network-status" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>News Updates</span>
                    <Switch id="news-updates" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Watchlist Alerts</span>
                    <Switch id="watchlist-alerts" defaultChecked />
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-2">Alert Frequency</h3>
                  <Select defaultValue="realtime">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select alert frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Privacy Settings</h3>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Anonymous Usage Analytics</span>
                    <Switch id="analytics" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Personalized Content</span>
                    <Switch id="personalization" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Remember Connected Wallets</span>
                    <Switch id="remember-wallets" defaultChecked />
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-2">Data Region</h3>
                  <Select defaultValue="global">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select data region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="global">Global</SelectItem>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="eu">European Union</SelectItem>
                      <SelectItem value="asia">Asia Pacific</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4">
                  <Button variant="outline" className="w-full">
                    Clear Local Data
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange && onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={() => onOpenChange && onOpenChange(false)}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
