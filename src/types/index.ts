export interface TokenData {
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: string | number;
  volume24h: string | number;
  chart: number[];
  image?: string;
  url?: string;
  description?: string;
  category?: string;
  chain?: string;
}

export interface TokenPriceHistory {
  timestamp: string;
  price: number;
}

export interface NetworkMetrics {
  tps: number;
  validators: number;
  totalTransactions: number;
  avgBlockTime: number;
  [key: string]: any;
}

export interface DappsData {
  dapps: {
    name: string;
    symbol: string;
    url: string;
    description: string;
    category: string;
    chain: string;
    market_cap: number;
    price_usd: number;
    price_change_24h: number;
    image: string;
  }[];
}
