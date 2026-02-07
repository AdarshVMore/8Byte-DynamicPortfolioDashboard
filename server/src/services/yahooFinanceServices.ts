import YahooFinance from 'yahoo-finance2';
import { stockPriceCache } from '../utils/cache';

const yahooFinance = new YahooFinance();

function getYahooSymbol(symbol: string, exchange: 'NSE' | 'BSE'): string {
  const suffix = exchange === 'NSE' ? '.NS' : '.BO';
  return `${symbol}${suffix}`;
}

export async function fetchStockPrice(
  symbol: string,
  exchange: 'NSE' | 'BSE'
): Promise<number | null> {
  const yahooSymbol = getYahooSymbol(symbol, exchange);

  const cached = stockPriceCache.get(yahooSymbol);
  if (cached !== null) {
    return cached;
  }

  try {
    const result = await yahooFinance.quote(yahooSymbol);

    if (!result) {
      console.error(`No quote data for ${yahooSymbol}`);
      return null;
    }

    const price = result.regularMarketPrice;

    if (typeof price !== 'number' || isNaN(price)) {
      console.error(`Invalid price for ${yahooSymbol}:`, price);
      return null;
    }

    stockPriceCache.set(yahooSymbol, price);

    return price;
  } catch (error) {
    console.error(`Failed to fetch price for ${yahooSymbol}:`, error);
    return null;
  }
}

export async function fetchStockPrices(
  symbols: string[],
  exchange: 'NSE' | 'BSE'
): Promise<Map<string, number>> {
  const results = new Map<string, number>();

  const promises = symbols.map(async (symbol) => {
    const price = await fetchStockPrice(symbol, exchange);
    return { symbol, price };
  });

  const settled = await Promise.allSettled(promises);

  settled.forEach((result) => {
    if (result.status === 'fulfilled' && result.value.price !== null) {
      results.set(result.value.symbol, result.value.price);
    }
  });

  return results;
}

export async function fetchMultipleStockPrices(
  stocks: Array<{ symbol: string; exchange: 'NSE' | 'BSE' }>
): Promise<Map<string, number | null>> {
  const results = new Map<string, number | null>();

  const promises = stocks.map(async ({ symbol, exchange }) => {
    const price = await fetchStockPrice(symbol, exchange);
    return { symbol, price };
  });

  const settled = await Promise.allSettled(promises);

  settled.forEach((result) => {
    if (result.status === 'fulfilled') {
      results.set(result.value.symbol, result.value.price);
    }
  });

  return results;
}
