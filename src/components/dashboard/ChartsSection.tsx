import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ChartsSectionProps {
  className?: string;
}

const ChartsSection = ({ className = "" }: ChartsSectionProps) => {
  const [timeRange, setTimeRange] = useState("7d");

  // Mock data for different chart types
  const transactionVolumeData = [
    { date: "2023-01-01", volume: 1200 },
    { date: "2023-01-02", volume: 1900 },
    { date: "2023-01-03", volume: 1600 },
    { date: "2023-01-04", volume: 2200 },
    { date: "2023-01-05", volume: 2500 },
    { date: "2023-01-06", volume: 2100 },
    { date: "2023-01-07", volume: 2800 },
  ];

  const gasFeeData = [
    { date: "2023-01-01", average: 0.05, max: 0.12 },
    { date: "2023-01-02", average: 0.06, max: 0.15 },
    { date: "2023-01-03", average: 0.04, max: 0.1 },
    { date: "2023-01-04", average: 0.07, max: 0.18 },
    { date: "2023-01-05", average: 0.08, max: 0.2 },
    { date: "2023-01-06", average: 0.06, max: 0.14 },
    { date: "2023-01-07", average: 0.05, max: 0.13 },
  ];

  const activeAddressesData = [
    { date: "2023-01-01", active: 45000 },
    { date: "2023-01-02", active: 48000 },
    { date: "2023-01-03", active: 52000 },
    { date: "2023-01-04", active: 49000 },
    { date: "2023-01-05", active: 53000 },
    { date: "2023-01-06", active: 56000 },
    { date: "2023-01-07", active: 58000 },
  ];

  return (
    <Card className={`w-full bg-white ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Analytics Charts</CardTitle>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24h</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="transactions">Transaction Volume</TabsTrigger>
            <TabsTrigger value="gas">Gas Fees</TabsTrigger>
            <TabsTrigger value="addresses">Active Addresses</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={transactionVolumeData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="volume"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Transaction Volume"
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="gas" className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={gasFeeData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="average"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Average Gas Fee"
                />
                <Line
                  type="monotone"
                  dataKey="max"
                  stroke="#ff7300"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Max Gas Fee"
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="addresses" className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={activeAddressesData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="active"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Active Addresses"
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ChartsSection;
