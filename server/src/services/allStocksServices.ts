import * as fs from "fs";
import { fetchStockPrices } from "./yahooFinanceServices";
import * as path from "path";

import {
  calculateGainLoss,
  calculateGainLossPercent,
  calculatePortfolioPercent,
  calculatePresentValue,
} from "../utils/calculations";

import type {
  Stock,
  EnrichedStock,
  SectorSummary,
  PortfolioSummary,
  PortfolioData,
} from "../types/allTypes";

function loadPortfolioData(): PortfolioData {
  const dataPath = path.join(__dirname, "../../data/portfolioData.json");
  const fileContent = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(fileContent) as PortfolioData;
}

function addStocksWithLiveData(stocks: Stock[], priceMap: Map<string, number>, totalPresentValue: number): EnrichedStock[] {
  return stocks.map(stock => {
    const cmp = priceMap.get(stock.symbol) || 0;
    const presentValue = calculatePresentValue(stock.quantity, cmp);
    const gainLoss = calculateGainLoss(presentValue, stock.investment);
    const gainLossPercent = calculateGainLossPercent(gainLoss, stock.investment);
    const portfolioPercent = totalPresentValue > 0 ? calculatePortfolioPercent(presentValue, totalPresentValue) : 0;

    return {
      ...stock,
      cmp,
      presentValue,
      gainLoss,
      gainLossPercent,
      portfolioPercent,
    };
  });
}


function calculateSectorSummary(
  sectorName: string,
  enrichedStocks: EnrichedStock[]
): SectorSummary {
  const totalInvestment = enrichedStocks.reduce(
    (sum, stock) => sum + stock.investment,
    0
  );

  const totalPresentValue = enrichedStocks.reduce(
    (sum, stock) => sum + (stock.presentValue || stock.investment),
    0
  );

  const totalGainLoss = totalPresentValue - totalInvestment;
  const gainLossPercent = calculateGainLossPercent(totalGainLoss, totalInvestment);

  return {
    name: sectorName,
    totalInvestment,
    totalPresentValue,
    totalGainLoss,
    gainLossPercent,
    stocks: enrichedStocks,
  };
}

export async function getPortfolioSummary(): Promise<PortfolioSummary> {
  const data = loadPortfolioData();

  const allStocks = data.sectors.flatMap((sector) => sector.stocks);

  const stocksByExchange = allStocks.reduce((acc, stock) => {
    if (!acc[stock.exchange]) {
      acc[stock.exchange] = [];
    }
    acc[stock.exchange].push(stock.symbol);
    return acc;
  }, {} as Record<string, string[]>);

  const priceMap = new Map<string, number>();
  for (const [exchange, symbols] of Object.entries(stocksByExchange)) {
    const prices = await fetchStockPrices(symbols, exchange as 'NSE' | 'BSE');
    prices.forEach((price, symbol) => priceMap.set(symbol, price));
  }

  const totalInvestment = data.sectors.reduce(
    (sum, sector) =>
      sum + sector.stocks.reduce((sectorSum, stock) => sectorSum + stock.investment, 0),
    0
  );

  const totalPresentValue = allStocks.reduce((sum, stock) => {
    const cmp = priceMap.get(stock.symbol) || 0;
    return sum + calculatePresentValue(stock.quantity, cmp);
  }, 0);

  const sectors: SectorSummary[] = data.sectors.map((sector) => {
    const enrichedStocks = addStocksWithLiveData(sector.stocks, priceMap, totalPresentValue);
    return calculateSectorSummary(sector.name, enrichedStocks);
  });

  const totalPresentValueFromSectors = sectors.reduce(
    (sum, sector) => sum + sector.totalPresentValue,
    0
  );

  const totalGainLoss = totalPresentValueFromSectors - totalInvestment;
  const gainLossPercent = calculateGainLossPercent(totalGainLoss, totalInvestment);

  return {
    totalInvestment,
    totalPresentValue: totalPresentValueFromSectors,
    totalGainLoss,
    gainLossPercent,
    sectors,
  };
}
