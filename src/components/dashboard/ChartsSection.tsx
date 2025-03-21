import React, { useState, useEffect } from "react";
import axios from "axios";
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
import { RefreshCw } from "lucide-react";

interface ChartsSectionProps {
  className?: string;
}

interface TransactionData {
  timestamp: string;
  value: number;
  date?: string; // Formatted date for display
}

interface GasFeeData {
  timestamp: string;
  average: number;
  max: number;
  date?: string; // Formatted date for display
}

interface ActiveAddressData {
  timestamp: string;
  active: number;
  date?: string; // Formatted date for display
}

// API base URL - use environment variable if available
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

const ChartsSection = ({ className = "" }: ChartsSectionProps) => {
  const [timeRange, setTimeRange] = useState("7d");
  const [transactionVolumeData, setTransactionVolumeData] = useState<
    TransactionData[]
  >([]);
  const [gasFeeData, setGasFeeData] = useState<GasFeeData[]>([]);
  const [activeAddressesData, setActiveAddressesData] = useState<
    ActiveAddressData[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

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

  // Generate mock data for fallback
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
      gas: mockGasData,
      addresses: mockAddressData,
    };
  };

  // Filter data based on selected time range
  const filterDataByTimeRange = (data: any[], range: string) => {
    if (!data || data.length === 0) {
      return [];
    }

    const now = new Date();
    let startDate: Date;

    switch (range) {
      case "24h":
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "90d":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case "1y":
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    return data
      .filter((item) => new Date(item.timestamp) >= startDate)
      .map((item) => ({
        ...item,
        date: formatDate(item.timestamp, range),
      }));
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
          setTransactionVolumeData(formattedData);
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
          setGasFeeData(formattedData);
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
  const fetchActiveAddressesData = async () => {
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
          setActiveAddressesData(formattedData);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error fetching active addresses data:", error);
      return false;
    }
  };

  // Handle refresh clicked by user
  const handleRefresh = () => {
    fetchData();
  };

  // Fetch all data
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Try to fetch all data
      const [txSuccess, gasSuccess, addrSuccess] = await Promise.all([
        fetchTransactionData(),
        fetchGasFeeData(),
        fetchActiveAddressesData(),
      ]);

      // If any data fetch failed, use mock data for those datasets
      if (!txSuccess || !gasSuccess || !addrSuccess) {
        const mockData = generateMockData(timeRange);

        if (!txSuccess) {
          console.log("Using mock transaction data");
          setTransactionVolumeData(mockData.transactions);
        }

        if (!gasSuccess) {
          console.log("Using mock gas fee data");
          setGasFeeData(mockData.gas);
        }

        if (!addrSuccess) {
          console.log("Using mock address data");
          setActiveAddressesData(mockData.addresses);
        }
      }

      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to fetch chart data:", err);
      // If all data fetching failed, use mock data
      const mockData = generateMockData(timeRange);
      setTransactionVolumeData(mockData.transactions);
      setGasFeeData(mockData.gas);
      setActiveAddressesData(mockData.addresses);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when component mounts or time range changes
  useEffect(() => {
    fetchData();
    // We're not setting up an interval here - data only refreshes when time range changes
    // or when user manually refreshes
  }, [timeRange]);

  return (
    <Card className={`w-full bg-base-100 ${className} border border-base-300`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold text-base-content">
          Analytics Charts
        </CardTitle>
        <div className="flex items-center space-x-3">
          {lastUpdated && (
            <p className="text-xs text-base-content/60">
              Updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="text-base-content/70 hover:text-primary disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </button>
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
        </div>
      </CardHeader>
      <CardContent className="text-base-content">
        {isLoading ? (
          <div className="flex justify-center items-center h-[320px]">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : (
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
                  <XAxis dataKey="date" stroke="currentColor" />
                  <YAxis stroke="currentColor" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--b1, oklch(var(--b1)/1))",
                      color: "var(--bc, oklch(var(--bc)/1))",
                      border: "1px solid var(--b3, oklch(var(--b3)/1))",
                    }}
                    formatter={(value) => [
                      Number(value).toLocaleString(),
                      "Transactions",
                    ]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
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
                  <XAxis dataKey="date" stroke="currentColor" />
                  <YAxis stroke="currentColor" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--b1, oklch(var(--b1)/1))",
                      color: "var(--bc, oklch(var(--bc)/1))",
                      border: "1px solid var(--b3, oklch(var(--b3)/1))",
                    }}
                    formatter={(value) => [`${value} AVAX`, ""]}
                  />
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
                  <XAxis dataKey="date" stroke="currentColor" />
                  <YAxis stroke="currentColor" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--b1, oklch(var(--b1)/1))",
                      color: "var(--bc, oklch(var(--bc)/1))",
                      border: "1px solid var(--b3, oklch(var(--b3)/1))",
                    }}
                    formatter={(value) => [
                      Number(value).toLocaleString(),
                      "Addresses",
                    ]}
                  />
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
        )}
      </CardContent>
    </Card>
  );
};

export default ChartsSection;
