'use client';

import { useStockData } from './lib/hooks/useStockData';
import { PortfolioSummary } from './components/portfolioSummary';
import { SectorGroup } from './components/sectorGroup';

export default function Home() {
  const { data, error, loading } = useStockData();

  if (loading && !data) {
    return (
      <div className="p-8 min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700">
        <div className="mx-auto max-w-7xl">
          <div className="h-96 flex justify-center items-center">
            <div className="text-center backdrop-blur-xl bg-white/20 p-12 rounded-2xl shadow-2xl border-white/30 border">
              <div className="border-solid mb-4 inline-block animate-spin h-12 w-12 rounded-full border-4 border-white/80 border-r-transparent"></div>
              <p className="text-white text-lg font-medium">Loading portfolio data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="bg-black min-h-screen from-blue-500 via-blue-600 to-purple-700">
      <div className="p-8 mx-auto max-w-7xl relative z-10">
        {error && (
          <div className="backdrop-blur-md mb-4 bg-yellow-500/25 p-4 border-yellow-300/40 border rounded-xl shadow-lg">
            <p className="text-sm text-yellow-50">
              <strong>Warning:</strong> {error}. Showing cached data.
            </p>
          </div>
        )}

        <PortfolioSummary summary={data} lastUpdated={null} onRefresh={function (): void {
          throw new Error('Function not implemented.');
        } } />

        <div className="space-y-8">
          {data.sectors.map((sector) => (
            <SectorGroup key={sector.name} sector={sector} />
          ))}
        </div>
      </div>
    </div>
  );
}
