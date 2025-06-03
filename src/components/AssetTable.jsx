import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Flex,
  Text,
  Image,
  IconButton,
  Badge,
  Skeleton,
  SkeletonCircle,
  HStack,
  useColorModeValue,
  Tooltip
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

export default function AssetTable({ assets, cryptoData, onRemoveAsset, onSelectAsset, isLoading }) {
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

  const getAssetData = (assetId) => {
    return cryptoData.find(crypto => crypto.id === assetId);
  };

  const calculateAssetValue = (asset) => {
    const cryptoInfo = getAssetData(asset.id);
    if (!cryptoInfo) return { value: 0, profit: 0, profitPercentage: 0 };
    
    const currentPrice = cryptoInfo.current_price;
    const value = asset.amount * currentPrice;
    
    // Calculate average purchase price
    let totalCost = 0;
    let totalAmount = 0;
    
    asset.transactions.forEach(transaction => {
      totalCost += transaction.amount * transaction.price;
      totalAmount += transaction.amount;
    });
    
    const avgPurchasePrice = totalCost / totalAmount;
    const profit = value - totalCost;
    const profitPercentage = (profit / totalCost) * 100;
    
    return { value, profit, profitPercentage, avgPurchasePrice };
  };

  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  return (
    <Box overflowX="auto">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Asset</Th>
            <Th isNumeric>Price</Th>
            <Th isNumeric>24h</Th>
            <Th isNumeric>Holdings</Th>
            <Th isNumeric>Value</Th>
            <Th isNumeric>Profit/Loss</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {isLoading ? (
            // Loading skeletons
            Array(5).fill(0).map((_, index) => (
              <Tr key={`skeleton-${index}`}>
                <Td>
                  <HStack>
                    <SkeletonCircle size="8" />
                    <Skeleton height="20px" width="120px" />
                  </HStack>
                </Td>
                <Td isNumeric><Skeleton height="20px" width="80px" ml="auto" /></Td>
                <Td isNumeric><Skeleton height="20px" width="60px" ml="auto" /></Td>
                <Td isNumeric><Skeleton height="20px" width="100px" ml="auto" /></Td>
                <Td isNumeric><Skeleton height="20px" width="100px" ml="auto" /></Td>
                <Td isNumeric><Skeleton height="20px" width="100px" ml="auto" /></Td>
                <Td><Skeleton height="20px" width="20px" /></Td>
              </Tr>
            ))
          ) : (
            assets.map(asset => {
              const cryptoInfo = getAssetData(asset.id);
              if (!cryptoInfo) return null;
              
              const { value, profit, profitPercentage } = calculateAssetValue(asset);
              
              return (
                <Tr 
                  key={asset.id}
                  _hover={{ bg: hoverBg, cursor: 'pointer' }}
                  onClick={() => onSelectAsset(asset)}
                >
                  <Td>
                    <Flex align="center">
                      <Image 
                        src={cryptoInfo.image} 
                        alt={cryptoInfo.name} 
                        boxSize="32px" 
                        mr={3} 
                      />
                      <Box>
                        <Text fontWeight="medium">{cryptoInfo.name}</Text>
                        <Text fontSize="sm" color="gray.500">{cryptoInfo.symbol.toUpperCase()}</Text>
                      </Box>
                    </Flex>
                  </Td>
                  <Td isNumeric>{formatCurrency(cryptoInfo.current_price)}</Td>
                  <Td isNumeric>
                    <Badge 
                      colorScheme={cryptoInfo.price_change_percentage_24h >= 0 ? 'green' : 'red'}
                      px={2}
                      py={1}
                      borderRadius="full"
                    >
                      {cryptoInfo.price_change_percentage_24h.toFixed(2)}%
                    </Badge>
                  </Td>
                  <Td isNumeric>
                    <Text>{asset.amount.toFixed(6)}</Text>
                  </Td>
                  <Td isNumeric fontWeight="medium">{formatCurrency(value)}</Td>
                  <Td isNumeric>
                    <Text 
                      color={profit >= 0 ? 'green.500' : 'red.500'}
                      fontWeight="medium"
                    >
                      {formatCurrency(profit)} ({formatPercentage(profitPercentage/100)})
                    </Text>
                  </Td>
                  <Td>
                    <Tooltip label="Remove asset">
                      <IconButton
                        aria-label="Remove asset"
                        icon={<DeleteIcon />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveAsset(asset.id);
                        }}
                      />
                    </Tooltip>
                  </Td>
                </Tr>
              );
            })
          )}
        </Tbody>
      </Table>
    </Box>
  );
}
