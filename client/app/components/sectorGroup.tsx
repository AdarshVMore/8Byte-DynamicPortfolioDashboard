import type { SectorSummary } from '../lib/types/portfolio';
import { formatCurrency, formatPercent } from '../lib/utils/calculations';
import { StockTable } from './stockTable';

interface SectorGroupProps {
  sector: SectorSummary;
}

export function SectorGroup({ sector }: SectorGroupProps) {
  const isProfit = sector.totalGainLoss >= 0;

  return (
    <div className="mb-8">
      <div className=" p-6  mb-4  rounded-2xl shadow-2xl">
        <h2 className="text-white mb-4 font-bold text-2xl drop-shadow-md">{sector.name}</h2>

        <div className="gap-4 grid grid-cols-2 md:grid-cols-4">
          <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl border-white/20 border hover:bg-white/30 duration-200 transition-all">
            <p className="mb-1 text-white/70 text-sm">Total Investment</p>
            <p className="font-semibold text-white text-xl">
              {formatCurrency(sector.totalInvestment)}
            </p>
          </div>

          <div className="p-4 backdrop-blur-md bg-white/20 border rounded-xl hover:bg-white/30 border-white/20 transition-all duration-200">
            <p className="text-sm mb-1 text-white/70">Present Value</p>
            <p className="text-xl text-white font-semibold">
              {formatCurrency(sector.totalPresentValue)}
            </p>
          </div>

          <div className={`rounded-xl backdrop-blur-lg p-4 border-white/30 border transition-all hover:bg-white/35 duration-200 ${isProfit ? 'bg-gradient-to-br from-emerald-500/25 to-emerald-600/20 border-emerald-300/30' : 'bg-gradient-to-br from-rose-500/25 to-rose-600/20 border-rose-300/30'} border transition-all hover:scale-[1.02] duration-300`}>
            <p className="text-white/70 text-sm mb-1">Gain/Loss</p>
            <p className={`font-bold text-xl ${isProfit ? 'text-green-500' : 'text-red-400'}`}>
              {formatCurrency(sector.totalGainLoss)}
            </p>
          </div>

          <div className={`backdrop-blur-lg p-4 border border-white/30 rounded-xl hover:bg-white/35 transition-all duration-200 ${isProfit ? 'bg-gradient-to-br from-emerald-500/25 to-emerald-600/20 border-emerald-300/30' : 'bg-gradient-to-br from-rose-500/25 to-rose-600/20 border-rose-300/30'} border transition-all hover:scale-[1.02] duration-300`}>
            <p className="mb-1 text-sm text-white/70">Gain/Loss %</p>
            <p className={`text-xl font-bold ${isProfit ? 'text-green-400' : 'text-red-400'}`}>
              {formatPercent(sector.gainLossPercent)}
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden bg-white/10 backdrop-blur-lg rounded-2xl border-white/20 shadow-2xl border">
        <StockTable stocks={sector.stocks} />
      </div>
    </div>
  );
}
