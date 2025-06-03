export const calculatePortfolioStats = (portfolio, cryptoData) => {
  if (!cryptoData.length || !portfolio.assets.length) {
    return {
      totalValue: 0,
      totalCost: 0,
      totalProfit: 0,
      totalProfitPercentage: 0,
      change24h: 0,
      changePercentage24h: 0
    };
  }

  let totalValue = 0;
  let totalCost = 0;
  let change24h = 0;

  portfolio.assets.forEach(asset => {
    const cryptoInfo = cryptoData.find(crypto => crypto.id === asset.id);
    if (!cryptoInfo) return;

    // Calculate current value
    const currentValue = asset.amount * cryptoInfo.current_price;
    totalValue += currentValue;

    // Calculate 24h change
    const previousValue = asset.amount * (cryptoInfo.current_price - cryptoInfo.price_change_24h);
    change24h += currentValue - previousValue;

    // Calculate total cost
    let assetCost = 0;
    asset.transactions.forEach(transaction => {
      assetCost += transaction.amount * transaction.price;
    });
    totalCost += assetCost;
  });

  // Calculate profit/loss
  const totalProfit = totalValue - totalCost;
  const totalProfitPercentage = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;
  
  // Calculate 24h change percentage
  const changePercentage24h = totalValue > 0 ? (change24h / (totalValue - change24h)) * 100 : 0;

  return {
    totalValue,
    totalCost,
    totalProfit,
    totalProfitPercentage,
    change24h,
    changePercentage24h
  };
};
