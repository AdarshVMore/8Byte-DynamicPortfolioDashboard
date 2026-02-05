export interface Stock {
  id: string;
  name: string;
  symbol: string;
  purchasePrice: number;
  quantity: number;
  investment: number;
  exchange: 'NSE' | 'BSE';
}

export interface Sector {
  name: string;
  stocks: Stock[];
}

export interface PortfolioData {
  sectors: Sector[];
}

export interface LiveStockData {
  cmp: number;
  presentValue: number;
  gainLoss: number;
  gainLossPercent: number;
  portfolioPercent: number;
}

export type EnrichedStock = Stock & Partial<LiveStockData>;

export interface SectorSummary {
  name: string;
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
  gainLossPercent: number;
  stocks: EnrichedStock[];
}

export interface PortfolioSummary {
  totalInvestment: number;
  totalPresentValue: number;
  totalGainLoss: number;
  gainLossPercent: number;
  sectors: SectorSummary[];
}

export interface StockQuoteResponse {
  symbol: string;
  cmp: number | null;
  error?: string;
}
