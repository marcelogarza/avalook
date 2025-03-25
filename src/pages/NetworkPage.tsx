import React, { useState, useEffect } from "react";
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
  AlertCircle,
  HelpCircle,
} from "lucide-react";

// Empty arrays instead of mock data
const tpsData = [];
const validators = [];

const NetworkPage = () => {
  // Add loading state
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="space-y-6 p-6 bg-background">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Network Status</h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-gray-400"></div>
            <span className="text-sm font-medium">Network Status Unknown</span>
          </div>
          <span className="text-sm text-muted-foreground">
            Last updated: N/A
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatusCard
          title="C-Chain"
          status="unknown"
          metric="N/A"
          description="Smart contract chain"
          icon={<Cpu className="h-5 w-5" />}
        />
        <StatusCard
          title="X-Chain"
          status="unknown"
          metric="N/A"
          description="Asset exchange chain"
          icon={<Activity className="h-5 w-5" />}
        />
        <StatusCard
          title="P-Chain"
          status="unknown"
          metric="N/A"
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
            {tpsData.length > 0 ? (
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
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                  <p className="text-muted-foreground">No chart data available</p>
                </div>
              </div>
            )}
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
                  className="bg-gray-400/10 text-gray-500 border-gray-400/20"
                >
                  <HelpCircle className="h-3 w-3 mr-1" /> Unknown
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <span>Public RPC Endpoints</span>
                </div>
                <Badge
                  variant="outline"
                  className="bg-gray-400/10 text-gray-500 border-gray-400/20"
                >
                  <HelpCircle className="h-3 w-3 mr-1" /> Unknown
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-muted-foreground" />
                  <span>Avalanche Bridge</span>
                </div>
                <Badge
                  variant="outline"
                  className="bg-gray-400/10 text-gray-500 border-gray-400/20"
                >
                  <HelpCircle className="h-3 w-3 mr-1" /> Unknown
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <span>Validator Network</span>
                </div>
                <Badge
                  variant="outline"
                  className="bg-gray-400/10 text-gray-500 border-gray-400/20"
                >
                  <HelpCircle className="h-3 w-3 mr-1" /> Unknown
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-muted-foreground" />
                  <span>Block Explorer</span>
                </div>
                <Badge
                  variant="outline"
                  className="bg-gray-400/10 text-gray-500 border-gray-400/20"
                >
                  <HelpCircle className="h-3 w-3 mr-1" /> Unknown
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
                  <span className="text-sm">N/A</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Block Time</span>
                  <span className="text-sm">N/A</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Current Gas Price</span>
                  <span className="text-sm">N/A</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Network Load</span>
                  <span className="text-sm">N/A</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Active Validators</span>
                  <span className="text-sm">N/A</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Validator Overview</CardTitle>
          <CardDescription>
            Information about top validators on the network
          </CardDescription>
        </CardHeader>
        <CardContent>
          {validators.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {validators.map((validator) => (
                <Card key={validator.id} className="overflow-hidden">
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">{validator.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Stake:</span>
                      <span className="font-medium">
                        {validator.stake.toLocaleString()} AVAX
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Delegations:</span>
                      <span className="font-medium">
                        {validator.delegations.toLocaleString()} AVAX
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Uptime:</span>
                      <span className="font-medium">{validator.uptime}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge
                        variant="outline"
                        className="bg-green-500/10 text-green-500 border-green-500/20"
                      >
                        {validator.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                <p className="text-muted-foreground">No validator data available</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

interface StatusCardProps {
  title: string;
  status: "operational" | "degraded" | "outage" | "unknown";
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
      case "unknown":
      default:
        return "bg-gray-400/10 text-gray-500 border-gray-400/20";
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
      case "unknown":
      default:
        return <HelpCircle className="h-3 w-3 mr-1" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-2xl font-bold">{metric}</div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {description}
            </span>
            <Badge
              variant="outline"
              className={getStatusColor(status)}
            >
              {getStatusIcon(status)} {status}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkPage;
