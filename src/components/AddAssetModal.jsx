import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  InputGroup,
  InputLeftElement,
  FormHelperText,
  VStack,
  HStack,
  Text,
  Image,
  Box,
  Flex,
  Divider
} from '@chakra-ui/react';

export default function AddAssetModal({ isOpen, onClose, onAddAsset, cryptoData }) {
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [amount, setAmount] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCryptos, setFilteredCryptos] = useState([]);

  useEffect(() => {
    if (cryptoData.length > 0) {
      setFilteredCryptos(cryptoData);
    }
  }, [cryptoData]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = cryptoData.filter(crypto => 
        crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCryptos(filtered);
    } else {
      setFilteredCryptos(cryptoData);
    }
  }, [searchQuery, cryptoData]);

  useEffect(() => {
    if (selectedCrypto) {
      const crypto = cryptoData.find(c => c.id === selectedCrypto);
      if (crypto) {
        setPurchasePrice(crypto.current_price.toString());
      }
    }
  }, [selectedCrypto, cryptoData]);

  const handleSubmit = () => {
    if (!selectedCrypto || !amount || !purchasePrice) return;
    
    const crypto = cryptoData.find(c => c.id === selectedCrypto);
    
    onAddAsset({
      id: selectedCrypto,
      name: crypto.name,
      symbol: crypto.symbol,
      amount: parseFloat(amount),
      purchasePrice: parseFloat(purchasePrice)
    });
    
    // Reset form
    setSelectedCrypto('');
    setAmount('');
    setPurchasePrice('');
    setSearchQuery('');
  };

  const handleClose = () => {
    // Reset form
    setSelectedCrypto('');
    setAmount('');
    setPurchasePrice('');
    setSearchQuery('');
    onClose();
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    }).format(value);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <ModalOverlay backdropFilter="blur(5px)" />
      <ModalContent borderRadius="xl">
        <ModalHeader>Add Asset to Portfolio</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Search Cryptocurrency</FormLabel>
              <Input
                placeholder="Search by name or symbol"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </FormControl>
            
            <FormControl isRequired>
              <FormLabel>Select Cryptocurrency</FormLabel>
              <Select
                placeholder="Select cryptocurrency"
                value={selectedCrypto}
                onChange={(e) => setSelectedCrypto(e.target.value)}
              >
                {filteredCryptos.slice(0, 100).map(crypto => (
                  <option key={crypto.id} value={crypto.id}>
                    {crypto.name} ({crypto.symbol.toUpperCase()})
                  </option>
                ))}
              </Select>
            </FormControl>
            
            {selectedCrypto && (
              <Box borderRadius="md" p={3} bg="gray.50">
                <Flex align="center">
                  {cryptoData.find(c => c.id === selectedCrypto) && (
                    <>
                      <Image 
                        src={cryptoData.find(c => c.id === selectedCrypto).image} 
                        boxSize="32px" 
                        mr={3} 
                      />
                      <Box>
                        <Text fontWeight="medium">
                          {cryptoData.find(c => c.id === selectedCrypto).name}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          Current Price: {formatCurrency(cryptoData.find(c => c.id === selectedCrypto).current_price)}
                        </Text>
                      </Box>
                    </>
                  )}
                </Flex>
              </Box>
            )}
            
            <FormControl isRequired>
              <FormLabel>Amount</FormLabel>
              <NumberInput
                min={0}
                precision={8}
                value={amount}
                onChange={(valueString) => setAmount(valueString)}
              >
                <NumberInputField placeholder="Enter amount" />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormHelperText>Enter the number of coins/tokens</FormHelperText>
            </FormControl>
            
            <FormControl isRequired>
              <FormLabel>Purchase Price (USD)</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none" color="gray.300">
                  $
                </InputLeftElement>
                <NumberInput
                  min={0}
                  precision={2}
                  value={purchasePrice}
                  onChange={(valueString) => setPurchasePrice(valueString)}
                  width="100%"
                >
                  <NumberInputField pl={7} placeholder="Enter purchase price" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </InputGroup>
              <FormHelperText>Price per coin/token in USD</FormHelperText>
            </FormControl>
            
            {selectedCrypto && amount && purchasePrice && (
              <Box borderRadius="md" p={3} bg="gray.50">
                <Text fontWeight="medium" mb={2}>Transaction Summary</Text>
                <Divider mb={2} />
                <HStack justify="space-between">
                  <Text>Total Cost:</Text>
                  <Text fontWeight="bold">
                    {formatCurrency(parseFloat(amount) * parseFloat(purchasePrice))}
                  </Text>
                </HStack>
              </Box>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            colorScheme="brand" 
            onClick={handleSubmit}
            isDisabled={!selectedCrypto || !amount || !purchasePrice}
          >
            Add to Portfolio
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
