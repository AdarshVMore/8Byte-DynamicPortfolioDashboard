'use client'

import {useState, useEffect} from 'react';
import { PortfolioSummary } from '../types/portfolio';

interface UseStockDataReturn {
  data: PortfolioSummary | null;
  loading: boolean;
  error: string | null;

}

export function useStockData(): UseStockDataReturn {
  const [data, setData] = useState<PortfolioSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const fetchStocksDta = async () => {
    try {
      const response = await fetch('/api/stocks');
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const result = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocksDta();
  }, []);

  return {data, loading, error};

}