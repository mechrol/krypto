import axios from 'axios';

// CoinGecko API base URL
const API_BASE_URL = 'https://api.coingecko.com/api/v3';

// Fetch top cryptocurrencies data
export const fetchCryptoData = async (limit = 250) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/coins/markets`, {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: limit,
        page: 1,
        sparkline: false,
        price_change_percentage: '24h'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    // Return mock data if API fails
    return getMockCryptoData();
  }
};

// Fetch global market data
export const fetchMarketData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/global`);
    const data = response.data.data;
    
    return {
      totalMarketCap: data.total_market_cap.usd,
      totalVolume: data.total_volume.usd,
      marketCapChange24h: data.market_cap_change_percentage_24h_usd,
      btcDominance: data.market_cap_percentage.btc,
      ethDominance: data.market_cap_percentage.eth
    };
  } catch (error) {
    console.error('Error fetching market data:', error);
    // Return mock data if API fails
    return {
      totalMarketCap: 2345678901234,
      totalVolume: 123456789012,
      marketCapChange24h: 2.5,
      btcDominance: 42.5,
      ethDominance: 18.3
    };
  }
};

// Fetch historical price data for a specific cryptocurrency
export const fetchHistoricalData = async (coinId, days = '30') => {
  try {
    const response = await axios.get(`${API_BASE_URL}/coins/${coinId}/market_chart`, {
      params: {
        vs_currency: 'usd',
        days: days
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching historical data for ${coinId}:`, error);
    // Return mock historical data if API fails
    return getMockHistoricalData(days);
  }
};

// Mock data in case API fails
const getMockCryptoData = () => {
  return [
    {
      id: "bitcoin",
      symbol: "btc",
      name: "Bitcoin",
      image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
      current_price: 57000,
      market_cap: 1100000000000,
      market_cap_rank: 1,
      price_change_percentage_24h: 2.5,
      price_change_24h: 1400,
      high_24h: 58000,
      low_24h: 55500
    },
    {
      id: "ethereum",
      symbol: "eth",
      name: "Ethereum",
      image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
      current_price: 3500,
      market_cap: 420000000000,
      market_cap_rank: 2,
      price_change_percentage_24h: 3.2,
      price_change_24h: 110,
      high_24h: 3600,
      low_24h: 3400
    },
    {
      id: "binancecoin",
      symbol: "bnb",
      name: "BNB",
      image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
      current_price: 550,
      market_cap: 85000000000,
      market_cap_rank: 3,
      price_change_percentage_24h: 1.8,
      price_change_24h: 9.8,
      high_24h: 560,
      low_24h: 540
    },
    {
      id: "solana",
      symbol: "sol",
      name: "Solana",
      image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
      current_price: 120,
      market_cap: 48000000000,
      market_cap_rank: 5,
      price_change_percentage_24h: 4.5,
      price_change_24h: 5.2,
      high_24h: 125,
      low_24h: 115
    },
    {
      id: "cardano",
      symbol: "ada",
      name: "Cardano",
      image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
      current_price: 0.55,
      market_cap: 19500000000,
      market_cap_rank: 8,
      price_change_percentage_24h: -1.2,
      price_change_24h: -0.007,
      high_24h: 0.56,
      low_24h: 0.54
    },
    {
      id: "polkadot",
      symbol: "dot",
      name: "Polkadot",
      image: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png",
      current_price: 7.8,
      market_cap: 9800000000,
      market_cap_rank: 12,
      price_change_percentage_24h: 2.1,
      price_change_24h: 0.16,
      high_24h: 7.9,
      low_24h: 7.6
    },
    {
      id: "avalanche-2",
      symbol: "avax",
      name: "Avalanche",
      image: "https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png",
      current_price: 35.5,
      market_cap: 12800000000,
      market_cap_rank: 10,
      price_change_percentage_24h: 3.8,
      price_change_24h: 1.3,
      high_24h: 36.2,
      low_24h: 34.1
    },
    {
      id: "chainlink",
      symbol: "link",
      name: "Chainlink",
      image: "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png",
      current_price: 14.2,
      market_cap: 8200000000,
      market_cap_rank: 15,
      price_change_percentage_24h: 2.9,
      price_change_24h: 0.4,
      high_24h: 14.5,
      low_24h: 13.8
    }
  ];
};

// Generate mock historical data
const getMockHistoricalData = (days) => {
  const numDataPoints = days === '1' ? 24 : parseInt(days);
  const prices = [];
  const basePrice = 50000; // Starting price
  const now = Date.now();
  const interval = (days === '1' ? 3600000 : 86400000); // 1 hour or 1 day in milliseconds
  
  for (let i = numDataPoints; i >= 0; i--) {
    const timestamp = now - (i * interval);
    // Generate a random price with some volatility
    const randomChange = (Math.random() - 0.5) * 0.05; // -2.5% to +2.5%
    const price = basePrice * (1 + randomChange * i);
    prices.push([timestamp, price]);
  }
  
  return { prices };
};
