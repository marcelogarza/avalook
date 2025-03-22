import React, { useState, useEffect } from "react";
import axios from "axios";
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
import { Loader2 } from "lucide-react";

// API base URL - use environment variable if available
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

// Interfaces for API data
interface TransactionData {
  name?: string;
  timestamp: string;
  value: number;
  date?: string;
}

interface GasFeeData {
  name?: string;
  timestamp: string;
  average: number;
  max: number;
  date?: string;
}

interface AddressData {
  name?: string;
  timestamp: string;
  active: number;
  date?: string;
}

interface NetworkComparisonData {
  name: string;
  tps: number;
}

interface SubnetData {
  name: string;
  value: number;
}

const ChartsPage = () => {
  const [timeRange, setTimeRange] = useState("7d");
  const [transactionData, setTransactionData] = useState<TransactionData[]>([]);
  const [feesData, setFeesData] = useState<GasFeeData[]>([]);
  const [addressData, setAddressData] = useState<AddressData[]>([]);
  const [networkComparison, setNetworkComparison] = useState<
    NetworkComparisonData[]
  >([]);
  const [subnetData, setSubnetData] = useState<SubnetData[]>([]);
  const [isLoading, setIsLoading] = useState({
    transactions: true,
    fees: true,
    addresses: true,
    comparison: true,
    subnets: true,
  });
  const [error, setError] = useState<string | null>(null);

  // Format date based on the time range
  const formatDate = (dateString: string, range: string) => {
    const date = new Date(dateString);
    if (range === "24h") {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  // Generate mock data for fallback or when API fails
  const generateMockData = (range: string) => {
    const now = new Date();
    let days: number;

    switch (range) {
      case "24h":
        days = 24; // Use hours for 24h view
        break;
      case "7d":
        days = 7;
        break;
      case "30d":
        days = 30;
        break;
      case "90d":
        days = 90;
        break;
      case "1y":
        days = 365;
        break;
      default:
        days = 7;
    }

    // For 24h view, generate hourly data points
    const interval = range === "24h" ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
    const pointCount = range === "24h" ? 24 : days;

    // Transaction volume mock data
    const mockTransactionData = Array(pointCount)
      .fill(null)
      .map((_, i) => {
        const date = new Date(now.getTime() - (pointCount - 1 - i) * interval);
        return {
          timestamp: date.toISOString(),
          value: 300000 + Math.floor(Math.random() * 100000),
          date: formatDate(date.toISOString(), range),
        };
      });

    // Gas fees mock data
    const mockGasData = Array(pointCount)
      .fill(null)
      .map((_, i) => {
        const date = new Date(now.getTime() - (pointCount - 1 - i) * interval);
        return {
          timestamp: date.toISOString(),
          average: 0.03 + Math.random() * 0.05,
          max: 0.1 + Math.random() * 0.1,
          date: formatDate(date.toISOString(), range),
        };
      });

    // Active addresses mock data
    const mockAddressData = Array(pointCount)
      .fill(null)
      .map((_, i) => {
        const date = new Date(now.getTime() - (pointCount - 1 - i) * interval);
        return {
          timestamp: date.toISOString(),
          active: 45000 + Math.floor(Math.random() * 15000),
          date: formatDate(date.toISOString(), range),
        };
      });

    return {
      transactions: mockTransactionData,
      fees: mockGasData,
      addresses: mockAddressData,
    };
  };

  // Fetch transaction data
  const fetchTransactionData = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/avalanche/transactions`,
        {
          timeout: 30000,
          params: { range: timeRange },
        }
      );

      if (response.data && Array.isArray(response.data)) {
        // Map the data to ensure it has the correct format
        const formattedData = response.data.map((item: any) => ({
          timestamp: item.timestamp,
          value: Number(item.value),
          date: formatDate(item.timestamp, timeRange),
        }));

        if (formattedData.length > 0) {
          setTransactionData(formattedData);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error fetching transaction data:", error);
      return false;
    }
  };

  // Fetch gas fee data
  const fetchGasFeeData = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/avalanche/gas-fees`,
        {
          timeout: 30000,
          params: { range: timeRange },
        }
      );

      if (response.data && Array.isArray(response.data)) {
        // Map the data to ensure it has the correct format
        const formattedData = response.data.map((item: any) => ({
          timestamp: item.timestamp,
          average: Number(item.average),
          max: Number(item.max),
          date: formatDate(item.timestamp, timeRange),
        }));

        if (formattedData.length > 0) {
          setFeesData(formattedData);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error fetching gas fee data:", error);
      return false;
    }
  };

  // Fetch active addresses data
  const fetchAddressData = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/avalanche/active-addresses`,
        {
          timeout: 30000,
          params: { range: timeRange },
        }
      );

      if (response.data && Array.isArray(response.data)) {
        // Map the data to ensure it has the correct format
        const formattedData = response.data.map((item: any) => ({
          timestamp: item.timestamp,
          active: Number(item.active),
          date: formatDate(item.timestamp, timeRange),
        }));

        if (formattedData.length > 0) {
          setAddressData(formattedData);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error fetching active addresses data:", error);
      return false;
    }
  };

  // Fetch network comparison data
  const fetchNetworkComparisonData = async () => {
    try {
      // This is a placeholder for a real API endpoint that would provide comparative data
      // For now, we'll use static data
      const mockComparisonData = [
        { name: "Avalanche", tps: 4500 },
        { name: "Ethereum", tps: 15 },
        { name: "Solana", tps: 65000 },
        { name: "Bitcoin", tps: 7 },
      ];

      setNetworkComparison(mockComparisonData);
      return true;
    } catch (error) {
      console.error("Error fetching network comparison data:", error);
      return false;
    }
  };

  // Fetch subnet data
  const fetchSubnetData = async () => {
    try {
      // This is a placeholder for a real API endpoint that would provide subnet data
      // For now, we'll use static data
      const mockSubnetData = [
        { name: "C-Chain", value: 400 },
        { name: "X-Chain", value: 300 },
        { name: "P-Chain", value: 200 },
        { name: "DeFi Subnet", value: 150 },
        { name: "Gaming Subnet", value: 100 },
      ];

      setSubnetData(mockSubnetData);
      return true;
    } catch (error) {
      console.error("Error fetching subnet data:", error);
      return false;
    }
  };

  // Fetch all chart data
  const fetchAllData = async () => {
    setIsLoading({
      transactions: true,
      fees: true,
      addresses: true,
      comparison: true,
      subnets: true,
    });
    setError(null);

    try {
      // Try to fetch all data
      const [txSuccess, feeSuccess, addrSuccess, compSuccess, subnetSuccess] =
        await Promise.all([
          fetchTransactionData(),
          fetchGasFeeData(),
          fetchAddressData(),
          fetchNetworkComparisonData(),
          fetchSubnetData(),
        ]);

      // If any data fetch failed, use mock data for those datasets
      if (!txSuccess || !feeSuccess || !addrSuccess) {
        const mockData = generateMockData(timeRange);

        if (!txSuccess) {
          console.log("Using mock transaction data");
          setTransactionData(mockData.transactions);
        }

        if (!feeSuccess) {
          console.log("Using mock gas fee data");
          setFeesData(mockData.fees);
        }

        if (!addrSuccess) {
          console.log("Using mock address data");
          setAddressData(mockData.addresses);
        }
      }
    } catch (err) {
      console.error("Failed to fetch chart data:", err);
      // If all data fetching failed, use mock data
      const mockData = generateMockData(timeRange);
      setTransactionData(mockData.transactions);
      setFeesData(mockData.fees);
      setAddressData(mockData.addresses);
      setError("Failed to load data. Using fallback data.");
    } finally {
      setIsLoading({
        transactions: false,
        fees: false,
        addresses: false,
        comparison: false,
        subnets: false,
      });
    }
  };

  // Fetch data when component mounts or timeRange changes
  useEffect(() => {
    fetchAllData();
  }, [timeRange]);

  return (
    <div className="space-y-6 p-6 bg-background">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Charts & Analytics
        </h1>
        <div className="flex items-center gap-2">
          <select
            className="px-3 py-2 rounded-md border"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
            Export Data
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded relative mb-6">
          {error}
        </div>
      )}

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
                {isLoading.transactions ? (
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={transactionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => [
                          Number(value).toLocaleString(),
                          "Transactions",
                        ]}
                      />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" name="Transactions" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
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
                {isLoading.fees ? (
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={feesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} AVAX`, ""]} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="average"
                        stroke="#82ca9d"
                        name="Average Gas Fees (AVAX)"
                      />
                      <Line
                        type="monotone"
                        dataKey="max"
                        stroke="#ff7300"
                        name="Max Gas Fees (AVAX)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
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
                {isLoading.addresses ? (
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={addressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => [
                          Number(value).toLocaleString(),
                          "Addresses",
                        ]}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="active"
                        fill="#ffc658"
                        stroke="#ff9800"
                        name="Active Addresses"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
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
              {isLoading.comparison ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={networkComparison}>
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
              )}
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
              {isLoading.subnets ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChartComponent data={subnetData} />
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Simple Pie Chart Component
const PieChartComponent = ({
  data,
}: {
  data: { name: string; value: number }[];
}) => {
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
