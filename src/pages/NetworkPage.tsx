import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  Area,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Server,
  Cpu,
  Activity,
  Zap,
  Globe,
  Shield,
} from "lucide-react";

const tpsData = [
  { time: "00:00", tps: 4200 },
  { time: "02:00", tps: 4100 },
  { time: "04:00", tps: 4300 },
  { time: "06:00", tps: 4500 },
  { time: "08:00", tps: 4700 },
  { time: "10:00", tps: 4600 },
  { time: "12:00", tps: 4400 },
  { time: "14:00", tps: 4500 },
  { time: "16:00", tps: 4800 },
  { time: "18:00", tps: 4700 },
  { time: "20:00", tps: 4600 },
  { time: "22:00", tps: 4500 },
];

const validators = [
  {
    id: "val1",
    name: "Avalanche Foundation",
    stake: 2_500_000,
    delegations: 12_500_000,
    uptime: 99.99,
    status: "active",
  },
  {
    id: "val2",
    name: "Figment Networks",
    stake: 1_800_000,
    delegations: 9_200_000,
    uptime: 99.95,
    status: "active",
  },
  {
    id: "val3",
    name: "P2P Validator",
    stake: 1_500_000,
    delegations: 7_500_000,
    uptime: 99.97,
    status: "active",
  },
  {
    id: "val4",
    name: "Staking Facilities",
    stake: 1_200_000,
    delegations: 6_800_000,
    uptime: 99.92,
    status: "active",
  },
  {
    id: "val5",
    name: "Everstake",
    stake: 1_100_000,
    delegations: 5_900_000,
    uptime: 99.9,
    status: "active",
  },
];

const NetworkPage = () => {
  return (
    <div className="space-y-6 p-6 bg-background">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Network Status</h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium">Network Healthy</span>
          </div>
          <span className="text-sm text-muted-foreground">
            Last updated: 2 minutes ago
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatusCard
          title="C-Chain"
          status="operational"
          metric="4,532 TPS"
          description="Smart contract chain"
          icon={<Cpu className="h-5 w-5" />}
        />
        <StatusCard
          title="X-Chain"
          status="operational"
          metric="1,245 TPS"
          description="Asset exchange chain"
          icon={<Activity className="h-5 w-5" />}
        />
        <StatusCard
          title="P-Chain"
          status="operational"
          metric="876 TPS"
          description="Platform chain"
          icon={<Shield className="h-5 w-5" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Network Performance</CardTitle>
          <CardDescription>
            Transactions per second over the last 24 hours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={tpsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="tps"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.2}
                  name="Transactions Per Second"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Network Health</CardTitle>
            <CardDescription>
              Current status of network components
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-muted-foreground" />
                  <span>API Services</span>
                </div>
                <Badge
                  variant="outline"
                  className="bg-green-500/10 text-green-500 border-green-500/20"
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Operational
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <span>Public RPC Endpoints</span>
                </div>
                <Badge
                  variant="outline"
                  className="bg-green-500/10 text-green-500 border-green-500/20"
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Operational
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-muted-foreground" />
                  <span>Avalanche Bridge</span>
                </div>
                <Badge
                  variant="outline"
                  className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                >
                  <AlertTriangle className="h-3 w-3 mr-1" /> Degraded
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <span>Validator Network</span>
                </div>
                <Badge
                  variant="outline"
                  className="bg-green-500/10 text-green-500 border-green-500/20"
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Operational
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-muted-foreground" />
                  <span>Block Explorer</span>
                </div>
                <Badge
                  variant="outline"
                  className="bg-green-500/10 text-green-500 border-green-500/20"
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Operational
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Network Statistics</CardTitle>
            <CardDescription>
              Key metrics about the Avalanche network
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Current TPS</span>
                  <span className="text-sm font-medium">
                    4,532 / 4,500 target
                  </span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Block Time</span>
                  <span className="text-sm font-medium">
                    2.1s / 2.0s target
                  </span>
                </div>
                <Progress value={95} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">
                    Validator Participation
                  </span>
                  <span className="text-sm font-medium">99.8%</span>
                </div>
                <Progress value={99.8} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Network Uptime</span>
                  <span className="text-sm font-medium">99.99%</span>
                </div>
                <Progress value={99.99} className="h-2" />
              </div>
              <div className="pt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted rounded-lg p-3">
                    <div className="text-sm text-muted-foreground">
                      Total Validators
                    </div>
                    <div className="text-2xl font-bold">1,243</div>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="text-sm text-muted-foreground">
                      Total Stake
                    </div>
                    <div className="text-2xl font-bold">245.6M AVAX</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Validators</CardTitle>
          <CardDescription>Validators with the highest stake</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Validator</th>
                  <th className="text-right py-3 px-4 font-medium">
                    Stake (AVAX)
                  </th>
                  <th className="text-right py-3 px-4 font-medium">
                    Delegations
                  </th>
                  <th className="text-right py-3 px-4 font-medium">Uptime</th>
                  <th className="text-right py-3 px-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {validators.map((validator) => (
                  <tr
                    key={validator.id}
                    className="border-b last:border-0 hover:bg-muted/50"
                  >
                    <td className="py-3 px-4">{validator.name}</td>
                    <td className="py-3 px-4 text-right">
                      {(validator.stake / 1_000_000).toFixed(2)}M
                    </td>
                    <td className="py-3 px-4 text-right">
                      {(validator.delegations / 1_000_000).toFixed(2)}M
                    </td>
                    <td className="py-3 px-4 text-right">
                      {validator.uptime}%
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Badge
                        variant="outline"
                        className={`bg-green-500/10 text-green-500 border-green-500/20`}
                      >
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Active
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface StatusCardProps {
  title: string;
  status: "operational" | "degraded" | "outage";
  metric: string;
  description: string;
  icon: React.ReactNode;
}

const StatusCard = ({
  title,
  status,
  metric,
  description,
  icon,
}: StatusCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "degraded":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "outage":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle2 className="h-3 w-3 mr-1" />;
      case "degraded":
        return <AlertTriangle className="h-3 w-3 mr-1" />;
      case "outage":
        return <XCircle className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary/10">{icon}</div>
            <CardTitle>{title}</CardTitle>
          </div>
          <Badge variant="outline" className={getStatusColor(status)}>
            {getStatusIcon(status)}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">{metric}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            Updated 30s ago
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkPage;
