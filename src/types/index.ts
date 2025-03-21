export interface TokenData {
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: string;
  volume24h: string;
  chart: number[];
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
