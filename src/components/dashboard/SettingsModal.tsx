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
import { Moon, Sun, Layout, Shield, Globe } from "lucide-react";
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
            <TabsList className="grid grid-cols-2 gap-2 mb-6">
              <TabsTrigger
                value="appearance"
                className="flex items-center gap-2"
              >
                <Layout size={16} />
                <span>Appearance & Layout</span>
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

            <TabsContent value="privacy" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Privacy Settings</h3>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p>Share Analytics Data</p>
                      <p className="text-sm text-muted-foreground">
                        Help improve the dashboard by sharing anonymous usage
                        data
                      </p>
                    </div>
                    <Switch id="share-analytics" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <p>Store Watchlist Locally</p>
                      <p className="text-sm text-muted-foreground">
                        Save your watchlist data on this device only
                      </p>
                    </div>
                    <Switch id="local-storage" defaultChecked />
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-2">Data Region</h3>
                  <Select defaultValue="auto">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select data region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">
                        <div className="flex items-center gap-2">
                          <Globe size={16} />
                          <span>Auto (Based on location)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="eu">European Union</SelectItem>
                      <SelectItem value="asia">Asia Pacific</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="mt-6 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange?.(false)}
            className="bg-base-100 border-base-300 text-base-content hover:bg-base-200"
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={() => onOpenChange?.(false)}
            className="bg-primary text-primary-content"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
