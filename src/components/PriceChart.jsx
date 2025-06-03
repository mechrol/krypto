import React, { useState, useEffect } from 'react';
import { Box, Center, Spinner, Text, Select } from '@chakra-ui/react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { fetchHistoricalData } from '../services/cryptoService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function PriceChart({ assetId, isLoading }) {
  const [chartData, setChartData] = useState(null);
  const [timeRange, setTimeRange] = useState('30');
  const [isChartLoading, setIsChartLoading] = useState(true);

  useEffect(() => {
    const getHistoricalData = async () => {
      setIsChartLoading(true);
      try {
        const data = await fetchHistoricalData(assetId, timeRange);
        
        if (data && data.prices) {
          const formattedData = {
            labels: data.prices.map(price => {
              const date = new Date(price[0]);
              if (timeRange === '1') {
                return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              } else if (timeRange === '7') {
                return date.toLocaleDateString([], { weekday: 'short' });
              } else {
                return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
              }
            }),
            datasets: [
              {
                label: 'Price',
                data: data.prices.map(price => price[1]),
                borderColor: 'rgba(139, 92, 246, 1)',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 4,
                tension: 0.4,
                fill: true
              }
            ]
          };
          setChartData(formattedData);
        }
      } catch (error) {
        console.error('Error fetching historical data:', error);
      } finally {
        setIsChartLoading(false);
      }
    };

    if (assetId) {
      getHistoricalData();
    }
  }, [assetId, timeRange]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(context.raw);
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxTicksLimit: 8
        }
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          callback: function(value) {
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              notation: 'compact'
            }).format(value);
          }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    elements: {
      line: {
        tension: 0.4
      }
    }
  };

  return (
    <Box>
      <Box mb={4}>
        <Select 
          value={timeRange} 
          onChange={(e) => setTimeRange(e.target.value)}
          size="sm"
          width="150px"
          float="right"
        >
          <option value="1">24 Hours</option>
          <option value="7">7 Days</option>
          <option value="30">30 Days</option>
          <option value="90">90 Days</option>
          <option value="365">1 Year</option>
        </Select>
      </Box>
      
      <Box h="250px" position="relative">
        {(isLoading || isChartLoading) ? (
          <Center h="100%">
            <Spinner size="xl" color="brand.500" thickness="4px" />
          </Center>
        ) : chartData ? (
          <Line data={chartData} options={options} />
        ) : (
          <Center h="100%">
            <Text color="gray.500">No price data available</Text>
          </Center>
        )}
      </Box>
    </Box>
  );
}
