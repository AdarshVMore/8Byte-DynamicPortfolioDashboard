import type { EnrichedStock } from '../lib/types/portfolio';
import { formatCurrency, formatPercent, formatNumber } from '../lib/utils/calculations';

interface StockTableProps {
  stocks: EnrichedStock[];
}

interface StockRowProps {
  stock: EnrichedStock;
}

function StockRow({ stock }: StockRowProps) {
  const hasLiveData = stock.cmp !== undefined;
  const isProfit = (stock.gainLoss ?? 0) >= 0;

  return (
    <tr className="border-b backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-200">
      <td className="py-3 px-4 text-white/90 text-sm">{stock.name}</td>
      <td className="text-sm px-4 py-3 text-right text-white/80">
        {formatCurrency(stock.purchasePrice)}
      </td>
      <td className="px-4 text-white/80 py-3 text-sm text-right">{stock.quantity}</td>
      <td className="text-right py-3 px-4 text-sm text-white/80">
        {formatCurrency(stock.investment)}
      </td>
      <td className="py-3 text-sm px-4 text-white/80 text-right">
        {stock.portfolioPercent !== undefined
          ? formatPercent(stock.portfolioPercent)
          : 'N/A'}
      </td>
      <td className="text-center px-4 py-3 text-sm text-white/80">
        {stock.symbol} ({stock.exchange})
      </td>
      <td className="px-4 text-right py-3 font-medium text-sm text-white/95">
        {hasLiveData ? formatCurrency(stock.cmp!) : 'N/A'}
      </td>
      <td className="text-sm py-3 text-white/95 px-4 text-right font-medium">
        {stock.presentValue !== undefined
          ? formatCurrency(stock.presentValue)
          : 'N/A'}
      </td>
      <td className={`text-right py-3 px-4 font-semibold text-sm ${isProfit ? 'text-green-300' : 'text-red-300'}`}>
        {stock.gainLoss !== undefined ? formatCurrency(stock.gainLoss) : 'N/A'}
      </td>
      <td className={`px-4 font-semibold py-3 text-sm text-right ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
        {stock.gainLossPercent !== undefined
          ? formatPercent(stock.gainLossPercent)
          : 'N/A'}
      </td>
    </tr>
  );
}

export function StockTable({ stocks }: StockTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="backdrop-blur-sm bg-white/20 border-white/20 border-b">
          <tr>
            <th className="text-left py-3 px-4 font-semibold text-xs tracking-wider text-white/90 uppercase">
              Stock Name
            </th>
            <th className="px-4 text-white/90 py-3 text-right uppercase text-xs font-semibold tracking-wider">
              Purchase Price
            </th>
            <th className="py-3 uppercase px-4 text-xs text-right font-semibold text-white/90 tracking-wider">
              Qty
            </th>
            <th className="text-right px-4 text-white/90 py-3 uppercase tracking-wider text-xs font-semibold">
              Investment
            </th>
            <th className="py-3 px-4 text-xs text-right uppercase font-semibold tracking-wider text-white/90">
              Portfolio %
            </th>
            <th className="text-center px-4 tracking-wider py-3 font-semibold text-white/90 text-xs uppercase">
              Symbol
            </th>
            <th className="text-xs px-4 py-3 uppercase text-right font-semibold tracking-wider text-white/90">
              CMP
            </th>
            <th className="px-4 tracking-wider py-3 text-white/90 uppercase text-right font-semibold text-xs">
              Present Value
            </th>
            <th className="py-3 text-right px-4 uppercase text-xs font-semibold text-white/90 tracking-wider">
              Gain/Loss
            </th>
            <th className="text-white/90 px-4 py-3 text-xs text-right tracking-wider uppercase font-semibold">
              Gain/Loss %
            </th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <StockRow key={stock.id} stock={stock} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
