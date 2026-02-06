import type { PortfolioSummary as PortfolioSummaryType } from '../lib/types/portfolio';
import { formatCurrency, formatPercent } from '../lib/utils/calculations';

interface PortfolioSummaryProps {
  summary: PortfolioSummaryType;
  lastUpdated: Date | null;
  onRefresh: () => void;
}

export function PortfolioSummary({
  summary,
}: PortfolioSummaryProps) {
  const isProfit = summary.totalGainLoss >= 0;

  return (
    <div className="mb-8">
      <div className="gap-6 grid grid-cols-1 md:grid-cols-3">
        <div className="bg-white/20 p-6 backdrop-blur-lg shadow-2xl rounded-2xl border border-white/30 hover:bg-white/25 transition-all duration-300">
          <p className="text-white/70 mb-2 text-sm">Total Investment</p>
          <p className="font-bold text-white text-3xl">
            {formatCurrency(summary.totalInvestment)}
          </p>
        </div>

        <div className="backdrop-blur-lg p-6 bg-white/20 border-white/30 rounded-2xl border shadow-2xl transition-all hover:bg-white/25 duration-300">
          <p className="mb-2 text-sm text-white/70">Current Value</p>
          <p className="text-white text-3xl font-bold">
            {formatCurrency(summary.totalPresentValue)}
          </p>
        </div>

        <div className={`rounded-2xl shadow-2xl p-6 backdrop-blur-xl ${isProfit ? 'bg-gradient-to-br from-emerald-500/25 to-emerald-600/20 border-emerald-300/30' : 'bg-gradient-to-br from-rose-500/25 to-rose-600/20 border-rose-300/30'} border transition-all hover:scale-[1.02] duration-300`}>
          <p className="text-sm mb-2 text-white/80">Total Gain/Loss</p>
          <p className={`font-bold text-3xl ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
            {formatCurrency(summary.totalGainLoss)}
          </p>
          <p className={`${isProfit ? 'text-green-400' : 'text-red-400'} mt-1 text-lg font-semibold`}>
            {formatPercent(summary.gainLossPercent)}
          </p>
        </div>
      </div>
    </div>
  );
}
