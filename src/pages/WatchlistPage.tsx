import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  CartesianGrid,
} from "recharts";
import {
  Search,
  Plus,
  Bell,
  TrendingUp,
  TrendingDown,
  Star,
  Trash2,
  Edit,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
} from "lucide-react";

const watchlistItems = [
  {
    id: "avax",
    name: "Avalanche",
    symbol: "AVAX",
    price: 28.45,
    change24h: 5.67,
    alerts: [
      { id: "a1", type: "price", condition: "above", value: 30, active: true },
    ],
    chart: [
      { time: "1d", price: 26.45 },
      { time: "2d", price: 27.12 },
      { time: "3d", price: 26.89 },
      { time: "4d", price: 27.45 },
      { time: "5d", price: 28.01 },
      { time: "6d", price: 27.65 },
      { time: "7d", price: 28.45 },
    ],
  },
  {
    id: "png",
    name: "Pangolin",
    symbol: "PNG",
    price: 0.12,
    change24h: 1.23,
    alerts: [],
    chart: [
      { time: "1d", price: 0.118 },
      { time: "2d", price: 0.119 },
      { time: "3d", price: 0.121 },
      { time: "4d", price: 0.12 },
      { time: "5d", price: 0.118 },
      { time: "6d", price: 0.119 },
      { time: "7d", price: 0.12 },
    ],
  },
  {
    id: "gmx",
    name: "GMX",
    symbol: "GMX",
    price: 45.67,
    change24h: -0.45,
    alerts: [
      { id: "a2", type: "price", condition: "below", value: 40, active: true },
    ],
    chart: [
      { time: "1d", price: 45.89 },
      { time: "2d", price: 45.76 },
      { time: "3d", price: 45.45 },
      { time: "4d", price: 45.34 },
      { time: "5d", price: 45.56 },
      { time: "6d", price: 45.78 },
      { time: "7d", price: 45.67 },
    ],
  },
];

const protocols = [
  {
    id: "trader-joe",
    name: "Trader Joe",
    category: "DEX",
    tvl: 245_000_000,
    change24h: 2.34,
  },
  {
    id: "benqi",
    name: "BENQI",
    category: "Lending",
    tvl: 125_000_000,
    change24h: 1.56,
  },
  {
    id: "platypus",
    name: "Platypus Finance",
    category: "Stablecoin DEX",
    tvl: 95_000_000,
    change24h: -0.78,
  },
];

const WatchlistPage = () => {
  const [activeTab, setActiveTab] = useState("tokens");
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const handleCreateAlert = (item: any) => {
    setSelectedItem(item);
    setAlertDialogOpen(true);
  };

  return (
    <div className="space-y-6 p-6 bg-background">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">My Watchlist</h1>
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search watchlist..." className="pl-8" />
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" /> Add Item
          </Button>
        </div>
      </div>

      <Tabs defaultValue="tokens" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
          <TabsTrigger value="protocols">Protocols</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {watchlistItems.map((item) => (
              <TokenCard
                key={item.id}
                item={item}
                onCreateAlert={() => handleCreateAlert(item)}
              />
            ))}
            {protocols.map((protocol) => (
              <ProtocolCard
                key={protocol.id}
                protocol={protocol}
                onCreateAlert={() => handleCreateAlert(protocol)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tokens" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {watchlistItems.map((item) => (
              <TokenCard
                key={item.id}
                item={item}
                onCreateAlert={() => handleCreateAlert(item)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="protocols" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {protocols.map((protocol) => (
              <ProtocolCard
                key={protocol.id}
                protocol={protocol}
                onCreateAlert={() => handleCreateAlert(protocol)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Active Alerts</CardTitle>
          <CardDescription>
            You'll be notified when these conditions are met
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {watchlistItems
              .flatMap((item) =>
                item.alerts.map((alert) => ({ ...alert, item }))
              )
              .map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <div>
                      <div className="font-medium">
                        {alert.item.name} ({alert.item.symbol})
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Price {alert.condition} ${alert.value}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-full hover:bg-muted">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-muted">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

            {watchlistItems.flatMap((item) => item.alerts).length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No alerts set up yet</p>
                <p className="text-sm">
                  Create alerts for tokens or protocols to get notified of price
                  changes
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Alert</DialogTitle>
            <DialogDescription>
              {selectedItem && `Set up an alert for ${selectedItem.name}`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Alert Type</label>
              <select className="w-full p-2 rounded-md border">
                <option>Price Alert</option>
                <option>Volume Alert</option>
                <option>News Alert</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Condition</label>
              <select className="w-full p-2 rounded-md border">
                <option>Price goes above</option>
                <option>Price goes below</option>
                <option>Price changes by</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Value</label>
              <Input type="number" placeholder="Enter value" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Notification Method</label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input type="checkbox" id="notify-email" className="mr-2" />
                  <label htmlFor="notify-email">Email</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="notify-push" className="mr-2" />
                  <label htmlFor="notify-push">Push Notification</label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAlertDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setAlertDialogOpen(false)}>
              Create Alert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface TokenCardProps {
  item: any;
  onCreateAlert: () => void;
}

const TokenCard = ({ item, onCreateAlert }: TokenCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>{item.name}</CardTitle>
            <Badge variant="outline">{item.symbol}</Badge>
          </div>
          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex justify-between items-center mb-4">
          <div className="text-2xl font-bold">
            ${item.price.toFixed(item.price < 1 ? 4 : 2)}
          </div>
          <div
            className={`flex items-center gap-1 ${
              item.change24h >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {item.change24h >= 0 ? (
              <ArrowUpRight className="h-4 w-4" />
            ) : (
              <ArrowDownRight className="h-4 w-4" />
            )}
            {Math.abs(item.change24h).toFixed(2)}%
          </div>
        </div>

        <div className="h-[100px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={item.chart}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                opacity={0.2}
              />
              <XAxis dataKey="time" hide />
              <YAxis hide domain={["auto", "auto"]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="price"
                stroke={item.change24h >= 0 ? "#10b981" : "#ef4444"}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button variant="outline" size="sm" onClick={onCreateAlert}>
          <Bell className="h-4 w-4 mr-2" />
          {item.alerts.length > 0
            ? `${item.alerts.length} Alert${item.alerts.length > 1 ? "s" : ""}`
            : "Set Alert"}
        </Button>
        <Button variant="outline" size="sm">
          <Trash2 className="h-4 w-4 mr-2" />
          Remove
        </Button>
      </CardFooter>
    </Card>
  );
};

interface ProtocolCardProps {
  protocol: any;
  onCreateAlert: () => void;
}

const ProtocolCard = ({ protocol, onCreateAlert }: ProtocolCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div>
            <CardTitle>{protocol.name}</CardTitle>
            <CardDescription>{protocol.category}</CardDescription>
          </div>
          <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-sm text-muted-foreground">
              Total Value Locked
            </div>
            <div className="text-2xl font-bold">
              ${(protocol.tvl / 1_000_000).toFixed(1)}M
            </div>
          </div>
          <div
            className={`flex items-center gap-1 ${
              protocol.change24h >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {protocol.change24h >= 0 ? (
              <ArrowUpRight className="h-4 w-4" />
            ) : (
              <ArrowDownRight className="h-4 w-4" />
            )}
            {Math.abs(protocol.change24h).toFixed(2)}%
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted rounded-lg p-3">
            <div className="text-xs text-muted-foreground">Users (24h)</div>
            <div className="text-lg font-bold">12.4K</div>
          </div>
          <div className="bg-muted rounded-lg p-3">
            <div className="text-xs text-muted-foreground">
              Transactions (24h)
            </div>
            <div className="text-lg font-bold">45.6K</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button variant="outline" size="sm" onClick={onCreateAlert}>
          <Bell className="h-4 w-4 mr-2" />
          Set Alert
        </Button>
        <Button variant="outline" size="sm">
          <Trash2 className="h-4 w-4 mr-2" />
          Remove
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WatchlistPage;
