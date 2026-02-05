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

function loadPortfolioData(): PortfolioData[] {
  const dataPath = path.join(__dirname, "../data/portfolioData.json");
  const fileContent = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(fileContent) as PortfolioData[];
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

  const totalInvestment = data.sectors.reduce(
    (sum:any, sector:any) =>
      sum + sector.stocks.reduce((sectorSum:any, stock:any) => sectorSum + stock.investment, 0),
    0
  );

  const allStocks = data.sectors.flatMap((sector:any) => sector.stocks);
  const stocksToFetch = allStocks.map((stock:any) => ({
    symbol: stock.symbol,
    exchange: stock.exchange,
  }));

  const prices = await fetchStockPrices(stocksToFetch, stocksToFetch[0].exchange);

  const sectors: SectorSummary[] = data.sectors.map((sector:any) => {
    const enrichedStocks = sector.stocks.map((stock:any) => {
      const cmp = prices.get(stock.symbol) ?? null;
      return addStocksWithLiveData(stock, cmp, totalInvestment);
    });

    return calculateSectorSummary(sector.name, enrichedStocks);
  });

  const totalPresentValue = sectors.reduce(
    (sum, sector) => sum + sector.totalPresentValue,
    0
  );

  const totalGainLoss = totalPresentValue - totalInvestment;
  const gainLossPercent = calculateGainLossPercent(totalGainLoss, totalInvestment);

  return {
    totalInvestment,
    totalPresentValue,
    totalGainLoss,
    gainLossPercent,
    sectors,
  };
}
