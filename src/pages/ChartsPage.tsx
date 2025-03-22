import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  LineChart,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Line,
  Area,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const data = [
  { name: "Jan", transactions: 4000, fees: 2400, addresses: 2400 },
  { name: "Feb", transactions: 3000, fees: 1398, addresses: 2210 },
  { name: "Mar", transactions: 2000, fees: 9800, addresses: 2290 },
  { name: "Apr", transactions: 2780, fees: 3908, addresses: 2000 },
  { name: "May", transactions: 1890, fees: 4800, addresses: 2181 },
  { name: "Jun", transactions: 2390, fees: 3800, addresses: 2500 },
  { name: "Jul", transactions: 3490, fees: 4300, addresses: 2100 },
];

const ChartsPage = () => {
  return (
    <div className="space-y-6 p-6 bg-background">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Charts & Analytics
        </h1>
        <div className="flex items-center gap-2">
          <select className="px-3 py-2 rounded-md border">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>Last year</option>
            <option>All time</option>
          </select>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
            Export Data
          </button>
        </div>
      </div>

      <Tabs defaultValue="transactions">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transactions">Transaction Volume</TabsTrigger>
          <TabsTrigger value="fees">Gas Fees</TabsTrigger>
          <TabsTrigger value="addresses">Active Addresses</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Volume</CardTitle>
              <CardDescription>
                Total number of transactions processed on the Avalanche network
                over time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="transactions"
                      fill="#8884d8"
                      name="Transactions"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Gas Fees</CardTitle>
              <CardDescription>
                Average gas fees on the Avalanche network over time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="fees"
                      stroke="#82ca9d"
                      name="Gas Fees (AVAX)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="addresses" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Addresses</CardTitle>
              <CardDescription>
                Number of unique active addresses on the Avalanche network over
                time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="addresses"
                      fill="#ffc658"
                      stroke="#ff9800"
                      name="Active Addresses"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Network Comparison</CardTitle>
            <CardDescription>
              Comparing Avalanche with other networks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: "Avalanche", tps: 4500 },
                    { name: "Ethereum", tps: 15 },
                    { name: "Solana", tps: 65000 },
                    { name: "Bitcoin", tps: 7 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="tps"
                    fill="#ff9800"
                    name="Transactions Per Second"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subnets Activity</CardTitle>
            <CardDescription>
              Activity across different Avalanche subnets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChartComponent />
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Simple Pie Chart Component
const PieChartComponent = () => {
  const data = [
    { name: "C-Chain", value: 400 },
    { name: "X-Chain", value: 300 },
    { name: "P-Chain", value: 200 },
    { name: "DeFi Subnet", value: 150 },
    { name: "Gaming Subnet", value: 100 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  return (
    <div className="flex items-center justify-center h-full">
      <div className="grid grid-cols-2 gap-4 w-full">
        {data.map((entry, index) => (
          <div key={`subnet-${index}`} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <div className="flex-1">
              <div className="text-sm font-medium">{entry.name}</div>
              <div className="text-xs text-muted-foreground">
                {entry.value} txns/s
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartsPage;
