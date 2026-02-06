'use client';

import Image from "next/image";
import { useStockData } from "./lib/hooks/useStockData";
import { PortfolioSummary } from "./components/portfolioSummary";

export default function Home() {
  const {data, error} = useStockData();
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <PortfolioSummary summary={data} />
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
