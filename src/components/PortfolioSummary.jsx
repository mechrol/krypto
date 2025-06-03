import React from 'react';
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Flex,
  Text,
  Icon,
  Skeleton,
  useColorModeValue
} from '@chakra-ui/react';
import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiActivity } from 'react-icons/fi';

function StatCard({ title, stat, helpText, type, icon, isLoading }) {
  const bgColor = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  
  return (
    <Stat
      px={{ base: 4, md: 6 }}
      py={5}
      bg={bgColor}
      shadow="md"
      rounded="lg"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
    >
      <Flex justifyContent="space-between">
        <Box>
          <StatLabel fontWeight="medium" isTruncated color={textColor}>
            {title}
          </StatLabel>
          <Skeleton isLoaded={!isLoading} mt={2}>
            <StatNumber fontSize="2xl" fontWeight="bold">
              {stat}
            </StatNumber>
          </Skeleton>
          <Skeleton isLoaded={!isLoading} mt={2}>
            {helpText && (
              <StatHelpText>
                {type && <StatArrow type={type} />}
                {helpText}
              </StatHelpText>
            )}
          </Skeleton>
        </Box>
        <Box
          my="auto"
          color={type === 'increase' ? 'green.400' : type === 'decrease' ? 'red.400' : 'gray.400'}
          alignContent="center"
        >
          <Icon as={icon} w={8} h={8} />
        </Box>
      </Flex>
    </Stat>
  );
}

export default function PortfolioSummary({ portfolioStats, marketData, isLoading }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercentage = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value / 100);
  };

  return (
    <Box>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={{ base: 5, lg: 8 }}>
        <StatCard
          title="Total Value"
          stat={formatCurrency(portfolioStats.totalValue)}
          helpText={`${formatCurrency(portfolioStats.totalProfit)} total profit`}
          type={portfolioStats.totalProfit >= 0 ? 'increase' : 'decrease'}
          icon={FiDollarSign}
          isLoading={isLoading}
        />
        <StatCard
          title="24h Change"
          stat={formatCurrency(portfolioStats.change24h)}
          helpText={formatPercentage(portfolioStats.changePercentage24h)}
          type={portfolioStats.change24h >= 0 ? 'increase' : 'decrease'}
          icon={portfolioStats.change24h >= 0 ? FiTrendingUp : FiTrendingDown}
          isLoading={isLoading}
        />
        <StatCard
          title="Total Profit/Loss"
          stat={formatPercentage(portfolioStats.totalProfitPercentage)}
          helpText={`Since first purchase`}
          type={portfolioStats.totalProfit >= 0 ? 'increase' : 'decrease'}
          icon={portfolioStats.totalProfit >= 0 ? FiTrendingUp : FiTrendingDown}
          isLoading={isLoading}
        />
        <StatCard
          title="Market Trend"
          stat={marketData.btcDominance ? `${marketData.btcDominance.toFixed(2)}% BTC` : '-'}
          helpText={marketData.marketCapChange24h ? `${marketData.marketCapChange24h.toFixed(2)}% 24h` : '-'}
          type={marketData.marketCapChange24h >= 0 ? 'increase' : 'decrease'}
          icon={FiActivity}
          isLoading={isLoading}
        />
      </SimpleGrid>
    </Box>
  );
}
