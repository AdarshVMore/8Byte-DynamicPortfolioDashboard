export function calculatePresentValue(quantity: number, cmp: number): number {
  return quantity * cmp;
}

export function calculateGainLoss(presentValue: number, investment: number): number {
  return presentValue - investment;
}

export function calculateGainLossPercent(gainLoss: number, investment: number): number {
  return (gainLoss / investment) * 100;
}

export function calculatePortfolioPercent(presentValue: number, totalPresentValue: number): number {
  return (presentValue / totalPresentValue) * 100;
}