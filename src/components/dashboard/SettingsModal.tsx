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
import { Moon, Sun, Palette, Shield } from "lucide-react";
import { getCurrentTheme, setTheme } from "@/lib/theme";

interface SettingsModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const SettingsModal = ({ open = true, onOpenChange }: SettingsModalProps) => {
  const [activeTab, setActiveTab] = useState("appearance");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [personalizedContent, setPersonalizedContent] = useState(false);
  const [rememberWallets, setRememberWallets] = useState(false);
  const [dataRegion, setDataRegion] = useState<string | undefined>(undefined);

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
                <Palette size={16} />
                <span>Appearance</span>
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
              </div>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Privacy Settings</h3>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Anonymous Usage Analytics</span>
                    <Switch 
                      id="analytics" 
                      checked={analyticsEnabled}
                      onCheckedChange={setAnalyticsEnabled}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Personalized Content</span>
                    <Switch 
                      id="personalization" 
                      checked={personalizedContent}
                      onCheckedChange={setPersonalizedContent}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Remember Connected Wallets</span>
                    <Switch 
                      id="remember-wallets" 
                      checked={rememberWallets}
                      onCheckedChange={setRememberWallets}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-2">Data Region</h3>
                  <Select 
                    value={dataRegion} 
                    onValueChange={setDataRegion}
                  >
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
