import { Router, Request, Response } from 'express';
import { getPortfolioSummary } from './services/allStocksServices';

const router = Router();

router.get('/stocks', async (req: Request, res: Response) => {
  try {
    const portfolioSummary = await getPortfolioSummary();
    res.json(portfolioSummary);
  } catch (error) {
    console.error('Error fetching portfolio summary:', error);
    res.status(500).json({
      error: 'Failed to fetch portfolio data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
