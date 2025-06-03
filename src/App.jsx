import React, { useState, useEffect } from 'react'
import { 
  Box, 
  Container, 
  Flex, 
  Heading, 
  Text, 
  useColorModeValue,
  useDisclosure,
  VStack,
  HStack,
  Button,
  IconButton,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Grid,
  GridItem,
  Image,
  Divider,
  useToast
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import Header from './components/Header'
import PortfolioSummary from './components/PortfolioSummary'
import AssetTable from './components/AssetTable'
import PortfolioChart from './components/PortfolioChart'
import PriceChart from './components/PriceChart'
import AddAssetModal from './components/AddAssetModal'
import { fetchCryptoData, fetchMarketData } from './services/cryptoService'
import { calculatePortfolioStats } from './utils/portfolioUtils'
import { SAMPLE_PORTFOLIO } from './data/sampleData'

function App() {
  const [portfolio, setPortfolio] = useState(() => {
    const savedPortfolio = localStorage.getItem('cryptoPortfolio');
    return savedPortfolio ? JSON.parse(savedPortfolio) : SAMPLE_PORTFOLIO;
  });
  const [cryptoData, setCryptoData] = useState([]);
  const [marketData, setMarketData] = useState({});
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Fetch crypto data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCryptoData();
        setCryptoData(data);
        
        const market = await fetchMarketData();
        setMarketData(market);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error fetching data',
          description: 'Could not load cryptocurrency data. Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        setIsLoading(false);
      }
    };

    fetchData();
    // Set up interval to refresh data every 2 minutes
    const intervalId = setInterval(fetchData, 120000);
    
    return () => clearInterval(intervalId);
  }, [toast]);

  // Save portfolio to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cryptoPortfolio', JSON.stringify(portfolio));
  }, [portfolio]);

  const handleAddAsset = (newAsset) => {
    // Check if asset already exists in portfolio
    const existingAssetIndex = portfolio.assets.findIndex(
      asset => asset.id === newAsset.id
    );

    if (existingAssetIndex >= 0) {
      // Update existing asset
      const updatedAssets = [...portfolio.assets];
      updatedAssets[existingAssetIndex] = {
        ...updatedAssets[existingAssetIndex],
        amount: updatedAssets[existingAssetIndex].amount + newAsset.amount,
        transactions: [
          ...updatedAssets[existingAssetIndex].transactions,
          {
            date: new Date().toISOString(),
            amount: newAsset.amount,
            price: newAsset.purchasePrice
          }
        ]
      };

      setPortfolio({
        ...portfolio,
        assets: updatedAssets
      });
    } else {
      // Add new asset
      setPortfolio({
        ...portfolio,
        assets: [
          ...portfolio.assets,
          {
            ...newAsset,
            transactions: [
              {
                date: new Date().toISOString(),
                amount: newAsset.amount,
                price: newAsset.purchasePrice
              }
            ]
          }
        ]
      });
    }

    toast({
      title: 'Asset added',
      description: `${newAsset.name} has been added to your portfolio.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    
    onClose();
  };

  const handleRemoveAsset = (assetId) => {
    setPortfolio({
      ...portfolio,
      assets: portfolio.assets.filter(asset => asset.id !== assetId)
    });

    toast({
      title: 'Asset removed',
      description: 'The asset has been removed from your portfolio.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleSelectAsset = (asset) => {
    setSelectedAsset(asset);
  };

  // Calculate portfolio statistics
  const portfolioStats = calculatePortfolioStats(portfolio, cryptoData);

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Header portfolioName={portfolio.name} />
      
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Portfolio Summary */}
          <PortfolioSummary 
            portfolioStats={portfolioStats} 
            marketData={marketData}
            isLoading={isLoading} 
          />
          
          {/* Charts Section */}
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6}>
            <GridItem>
              <Box 
                bg="white" 
                p={6} 
                borderRadius="xl" 
                boxShadow="md" 
                height="100%"
              >
                <Heading size="md" mb={4}>Portfolio Allocation</Heading>
                <PortfolioChart 
                  portfolio={portfolio} 
                  cryptoData={cryptoData} 
                  isLoading={isLoading} 
                />
              </Box>
            </GridItem>
            
            <GridItem>
              <Box 
                bg="white" 
                p={6} 
                borderRadius="xl" 
                boxShadow="md"
                height="100%"
              >
                <Heading size="md" mb={4}>
                  {selectedAsset ? `${selectedAsset.name} Price Chart` : 'Bitcoin Price Chart'}
                </Heading>
                <PriceChart 
                  assetId={selectedAsset ? selectedAsset.id : 'bitcoin'} 
                  isLoading={isLoading} 
                />
              </Box>
            </GridItem>
          </Grid>
          
          {/* Assets Table */}
          <Box bg="white" p={6} borderRadius="xl" boxShadow="md">
            <Flex justify="space-between" align="center" mb={4}>
              <Heading size="md">Your Assets</Heading>
              <Button 
                leftIcon={<AddIcon />} 
                colorScheme="brand" 
                onClick={onOpen}
              >
                Add Asset
              </Button>
            </Flex>
            
            <AssetTable 
              assets={portfolio.assets} 
              cryptoData={cryptoData} 
              onRemoveAsset={handleRemoveAsset}
              onSelectAsset={handleSelectAsset}
              isLoading={isLoading}
            />
          </Box>
        </VStack>
      </Container>
      
      {/* Add Asset Modal */}
      <AddAssetModal 
        isOpen={isOpen} 
        onClose={onClose} 
        onAddAsset={handleAddAsset}
        cryptoData={cryptoData}
      />
    </Box>
  )
}

export default App
