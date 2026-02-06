'use client';
import { useEffect, useState } from 'react';

interface PortfolioSummaryData {
  totalInvestment: number;
  presentValue: number;
  gainLoss: number;
}

export const PortfolioSummary: React.FC<{ summary:any }> = ({ summary }) => {


  if (!summary) {
    return <div>Loading...</div>;
  }

  return (
    <div className="portfolio-summary">
      <h2>Portfolio Summary</h2>
      <p>Total Investment: ₹{summary.totalInvestment.toFixed(2)}</p>
      <p>Present Value: ₹{summary.presentValue.toFixed(2)}</p>
      <p>Gain/Loss: ₹{summary.gainLoss.toFixed(2)}</p>
    </div>
  );
}