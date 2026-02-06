import { get } from 'http';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

function getYahooSymbol(symbol: string, exchange: 'NSE' | 'BSE'): string {
  const suffix = exchange === 'NSE' ? '.NS' : '.BO';
  return `${symbol}${suffix}`;
}

export async function fetchStockPrices(symbol: string[], exchange: 'NSE' | 'BSE'): Promise<Map<string, number>> {
    const yahooSymbols = symbol.map(s => getYahooSymbol(s, exchange));
    const priceMap = new Map<string, number>();

  try {
    const results = await yahooFinance.quote(yahooSymbols);

    results.forEach((result, index) => {
      const price = result.regularMarketPrice;
      if (typeof price === 'number' && !isNaN(price)) {
        priceMap.set(symbol[index], price);
      } else {
        console.error(`Invalid price for ${yahooSymbols[index]}:`, price);
      }
    });

    return priceMap;
  } catch (error) {
    console.error(`Failed to fetch prices for ${yahooSymbols}:`, error);
    return priceMap;
  }
}