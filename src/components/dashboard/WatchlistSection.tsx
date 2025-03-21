import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Switch } from "../../components/ui/switch";
import { Label } from "../../components/ui/label";
import {
  Plus,
  X,
  Bell,
  ArrowUpRight,
  Search,
  AlertTriangle,
} from "lucide-react";

interface WatchlistItem {
  id: string;
  name: string;
  type: "Protocol" | "Token";
  price?: number;
  change24h?: number;
  alerts: boolean;
}

interface WatchlistSectionProps {
  watchlistItems?: WatchlistItem[];
}

const WatchlistSection = ({
  watchlistItems = defaultWatchlistItems,
}: WatchlistSectionProps) => {
  const [items, setItems] = useState<WatchlistItem[]>(watchlistItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemType, setNewItemType] = useState<"Protocol" | "Token">(
    "Protocol",
  );

  const addItem = () => {
    if (newItemName.trim()) {
      const newItem: WatchlistItem = {
        id: Math.random().toString(36).substring(2, 9),
        name: newItemName,
        type: newItemType,
        price: Math.random() * 100,
        change24h: Math.random() * 20 - 10,
        alerts: false,
      };
      setItems([...items, newItem]);
      setNewItemName("");
      setDialogOpen(false);
    }
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const toggleAlert = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, alerts: !item.alerts } : item,
      ),
    );
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Watchlist</CardTitle>
        <div className="flex items-center space-x-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search watchlist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add to Watchlist</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter protocol or token name"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Type</Label>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="protocol"
                        name="type"
                        checked={newItemType === "Protocol"}
                        onChange={() => setNewItemType("Protocol")}
                      />
                      <Label htmlFor="protocol">Protocol</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="token"
                        name="type"
                        checked={newItemType === "Token"}
                        onChange={() => setNewItemType("Token")}
                      />
                      <Label htmlFor="token">Token</Label>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={addItem}>Add to Watchlist</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">
              Your watchlist is empty or no items match your search.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setDialogOpen(true);
              }}
            >
              Add your first item
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">24h Change</TableHead>
                  <TableHead className="text-center">Alerts</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.type === "Protocol" ? "outline" : "secondary"
                        }
                      >
                        {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {item.price ? `$${item.price.toFixed(2)}` : "--"}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={
                          item.change24h && item.change24h > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {item.change24h
                          ? `${item.change24h > 0 ? "+" : ""}${item.change24h.toFixed(2)}%`
                          : "--"}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={item.alerts}
                        onCheckedChange={() => toggleAlert(item.id)}
                        aria-label="Toggle alerts"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ArrowUpRight className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => removeItem(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const defaultWatchlistItems: WatchlistItem[] = [
  {
    id: "1",
    name: "Trader Joe",
    type: "Protocol",
    price: 0.42,
    change24h: 5.23,
    alerts: true,
  },
  {
    id: "2",
    name: "AVAX",
    type: "Token",
    price: 28.45,
    change24h: -2.18,
    alerts: true,
  },
  {
    id: "3",
    name: "Pangolin",
    type: "Protocol",
    price: 0.03,
    change24h: 1.05,
    alerts: false,
  },
  {
    id: "4",
    name: "GMX",
    type: "Token",
    price: 42.67,
    change24h: 8.92,
    alerts: false,
  },
  {
    id: "5",
    name: "Platypus Finance",
    type: "Protocol",
    price: 0.12,
    change24h: -4.37,
    alerts: true,
  },
];

export default WatchlistSection;
