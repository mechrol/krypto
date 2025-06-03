import React, { useState, useEffect } from 'react';
import { Box, Center, Spinner, Text } from '@chakra-ui/react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PortfolioChart({ portfolio, cryptoData, isLoading }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (isLoading || !cryptoData.length || !portfolio.assets.length) return;

    const prepareChartData = () => {
      // Calculate value for each asset
      const assetsWithValue = portfolio.assets.map(asset => {
        const cryptoInfo = cryptoData.find(crypto => crypto.id === asset.id);
        if (!cryptoInfo) return { ...asset, value: 0 };
        
        const value = asset.amount * cryptoInfo.current_price;
        return { ...asset, value, name: cryptoInfo.name };
      });

      // Sort by value (descending)
      const sortedAssets = [...assetsWithValue].sort((a, b) => b.value - a.value);
      
      // Take top 5 assets, group the rest as "Others"
      let chartAssets = sortedAssets.slice(0, 5);
      const otherAssets = sortedAssets.slice(5);
      
      if (otherAssets.length > 0) {
        const otherValue = otherAssets.reduce((sum, asset) => sum + asset.value, 0);
        if (otherValue > 0) {
          chartAssets.push({ id: 'others', name: 'Others', value: otherValue });
        }
      }

      // Generate colors
      const colors = [
        'rgba(139, 92, 246, 0.8)', // brand.500
        'rgba(79, 70, 229, 0.8)',  // indigo.600
        'rgba(16, 185, 129, 0.8)', // green.500
        'rgba(245, 158, 11, 0.8)', // amber.500
        'rgba(239, 68, 68, 0.8)',  // red.500
        'rgba(107, 114, 128, 0.8)' // gray.500 (for Others)
      ];

      return {
        labels: chartAssets.map(asset => asset.name),
        datasets: [
          {
            data: chartAssets.map(asset => asset.value),
            backgroundColor: colors,
            borderColor: colors.map(color => color.replace('0.8', '1')),
            borderWidth: 1,
            hoverOffset: 15
          }
        ]
      };
    };

    setChartData(prepareChartData());
  }, [portfolio, cryptoData, isLoading]);

  const options = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            
            const formattedValue = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(value);
            
            return `${context.label}: ${formattedValue} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '65%',
    responsive: true,
    maintainAspectRatio: false
  };

  if (isLoading) {
    return (
      <Center h="300px">
        <Spinner size="xl" color="brand.500" thickness="4px" />
      </Center>
    );
  }

  if (!chartData || portfolio.assets.length === 0) {
    return (
      <Center h="300px">
        <Text color="gray.500">No assets in portfolio to display</Text>
      </Center>
    );
  }

  return (
    <Box h="300px" position="relative">
      <Doughnut data={chartData} options={options} />
    </Box>
  );
}
