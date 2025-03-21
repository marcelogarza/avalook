import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  TabsContent,
  Tabs,
  TabsList,
  TabsTrigger,
} from "../ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { Badge } from "../ui/badge";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUp, MoreHorizontal, Sparkles } from "lucide-react";

interface TokenData {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  sparkline?: number[];
  history?: { timestamp: string; price: number }[];
}

interface TokenPriceSectionProps {
  tokens?: TokenData[];
}

// Custom tooltip component for charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-base-200 p-2 border border-base-300 shadow-md rounded-md">
        <p className="text-xs font-medium">{`${new Date(label).toLocaleDateString()}`}</p>
        <p className="text-xs text-primary">{`Price: $${payload[0].value.toFixed(2)}`}</p>
      </div>
    );
  }
  return null;
};

// Token price card component
const TokenCard = ({ token }: { token: TokenData }) => {
  return (
    <div className="border border-base-300 rounded-lg p-4 hover:bg-base-200 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <img
            src={token.image}
            alt={token.name}
            className="w-8 h-8 mr-3 rounded-full"
          />
          <div>
            <h3 className="font-medium">{token.name}</h3>
            <span className="text-xs text-base-content/70">{token.symbol.toUpperCase()}</span>
          </div>
        </div>
        <Badge
          variant={token.price_change_percentage_24h >= 0 ? "default" : "destructive"}
          className="text-xs"
        >
          {token.price_change_percentage_24h >= 0 ? (
            <ArrowUp className="h-3 w-3 mr-1" />
          ) : (
            <ArrowDown className="h-3 w-3 mr-1" />
          )}
          {Math.abs(token.price_change_percentage_24h).toFixed(2)}%
        </Badge>
      </div>
      <div className="text-xl font-bold mb-2">${token.current_price.toFixed(2)}</div>
      
      {token.sparkline && token.sparkline.length > 0 && (
        <div className="h-12 mt-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={token.sparkline.map((value, i) => ({ timestamp: i, price: value }))}>
              <Line
                type="monotone"
                dataKey="price"
                stroke={token.price_change_percentage_24h >= 0 ? "#10b981" : "#ef4444"}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
        <div>
          <p className="text-base-content/70">Market Cap</p>
          <p className="font-medium">${formatNumber(token.market_cap)}</p>
        </div>
        <div>
          <p className="text-base-content/70">24h Volume</p>
          <p className="font-medium">${formatNumber(token.total_volume)}</p>
        </div>
      </div>
    </div>
  );
};

// Format large numbers with abbreviations
const formatNumber = (num: number): string => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

// Main TokenPriceSection component
const TokenPriceSection = ({ tokens: propTokens }: TokenPriceSectionProps) => {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [activeTab, setActiveTab] = useState("avalanche-2");
  const [selectedTokenHistory, setSelectedTokenHistory] = useState<{ timestamp: string; price: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (propTokens && propTokens.length > 0) {
      setTokens(propTokens);
      setLoading(false);
    } else {
      fetchTokenData();
    }
  }, [propTokens]);

  useEffect(() => {
    if (tokens.length > 0) {
      fetchTokenHistory(activeTab);
    }
  }, [activeTab, tokens]);

  const fetchTokenData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5001/api/token-prices");
      
      const avaxToken = {
        id: "avalanche-2",
        name: "Avalanche",
        symbol: "avax",
        image: "https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png",
        current_price: response.data["avalanche-2"].usd,
        price_change_percentage_24h: response.data["avalanche-2"].usd_24h_change,
        market_cap: response.data["avalanche-2"].usd_market_cap,
        total_volume: response.data["avalanche-2"].usd_24h_vol,
      };
      
      const joeToken = {
        id: "joe",
        name: "JOE",
        symbol: "joe",
        image: "https://assets.coingecko.com/coins/images/17569/small/traderjoe.jpg",
        current_price: response.data["joe"].usd,
        price_change_percentage_24h: response.data["joe"].usd_24h_change,
        market_cap: response.data["joe"].usd_market_cap,
        total_volume: response.data["joe"].usd_24h_vol,
      };
      
      const pangolinToken = {
        id: "pangolin",
        name: "Pangolin",
        symbol: "png",
        image: "https://assets.coingecko.com/coins/images/14023/small/pangolin.jpg",
        current_price: response.data["pangolin"].usd,
        price_change_percentage_24h: response.data["pangolin"].usd_24h_change,
        market_cap: response.data["pangolin"].usd_market_cap,
        total_volume: response.data["pangolin"].usd_24h_vol,
      };
      
      setTokens([avaxToken, joeToken, pangolinToken]);
      
      // Fetch history for the default token
      await fetchTokenHistory("avalanche-2");
      
    } catch (error) {
      console.error("Error fetching token data:", error);
      // Set some fallback data
      setTokens([
        {
          id: "avalanche-2",
          name: "Avalanche",
          symbol: "avax",
          image: "https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png",
          current_price: 27.42,
          price_change_percentage_24h: 1.94,
          market_cap: 9812000000,
          total_volume: 172400000,
        },
        {
          id: "joe",
          name: "JOE",
          symbol: "joe",
          image: "https://assets.coingecko.com/coins/images/17569/small/traderjoe.jpg",
          current_price: 0.68,
          price_change_percentage_24h: -1.8,
          market_cap: 233400000,
          total_volume: 14700000,
        },
        {
          id: "pangolin",
          name: "Pangolin",
          symbol: "png",
          image: "https://assets.coingecko.com/coins/images/14023/small/pangolin.jpg",
          current_price: 0.12,
          price_change_percentage_24h: 5.4,
          market_cap: 34200000,
          total_volume: 2100000,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTokenHistory = async (tokenId: string) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/token-history/${tokenId}`);
      
      if (response.data && response.data.prices) {
        const formattedHistory = response.data.prices.map((item: [number, number]) => ({
          timestamp: new Date(item[0]).toISOString(),
          price: item[1]
        }));
        
        setSelectedTokenHistory(formattedHistory);
      }
    } catch (error) {
      console.error(`Error fetching history for ${tokenId}:`, error);
      
      // Generate mock data if API fails
      const mockHistory = generateMockPriceHistory(
        tokens.find(t => t.id === tokenId)?.current_price || 25, 
        30
      );
      setSelectedTokenHistory(mockHistory);
    }
  };

  // Generate mock price history data
  const generateMockPriceHistory = (currentPrice: number, days: number) => {
    const history = [];
    const now = new Date();
    const volatility = currentPrice * 0.05; // 5% volatility
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Generate price with some random walk
      const randomChange = (Math.random() - 0.5) * volatility;
      const price = currentPrice * (1 + (i - days/2) * 0.01) + randomChange;
      
      history.push({
        timestamp: date.toISOString(),
        price: price > 0 ? price : 0.01 // Ensure price is positive
      });
    }
    
    return history;
  };

  const getActiveToken = () => {
    return tokens.find(token => token.id === activeTab) || tokens[0];
  };

  return (
    <Card className="w-full h-full flex flex-col border border-base-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold text-base-content">
            Token Prices
          </CardTitle>
          <Link to="/charts" className="text-sm text-primary hover:underline flex items-center">
            <span>View all</span>
            <MoreHorizontal className="h-4 w-4 ml-1" />
          </Link>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="avalanche-2" className="text-xs sm:text-sm">AVAX</TabsTrigger>
            <TabsTrigger value="joe" className="text-xs sm:text-sm">JOE</TabsTrigger>
            <TabsTrigger value="pangolin" className="text-xs sm:text-sm">PNG</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse space-y-4 w-full">
              <div className="h-40 bg-base-300 rounded"></div>
              <div className="h-20 bg-base-300 rounded"></div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-grow"> 
              <div className="h-[200px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={selectedTokenHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                    <XAxis 
                      dataKey="timestamp" 
                      tick={{ fontSize: 12 }} 
                      tickFormatter={formatDate} 
                      stroke="#6B7280" 
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }} 
                      domain={['dataMin', 'dataMax']} 
                      stroke="#6B7280"
                      tickFormatter={(value) => `$${value.toFixed(2)}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke={getActiveToken()?.price_change_percentage_24h >= 0 ? "#10b981" : "#ef4444"} 
                      strokeWidth={2} 
                      dot={false} 
                      activeDot={{ r: 5 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="py-4 mt-4 border-t border-base-300">
                <h3 className="text-lg font-medium mb-3">Top Avalanche Tokens</h3>
                <div className="grid grid-cols-1 gap-4">
                  {tokens.map((token) => (
                    <TokenCard key={token.id} token={token} />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TokenPriceSection;
