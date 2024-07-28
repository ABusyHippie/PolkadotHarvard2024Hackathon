import { Address } from '@unique-nft/utils';

// Function to convert Ethereum address to Substrate address
const convertEthereumToSubstrate = (ethereumAddress) => {
    try {
        const substrateAddress = Address.mirror.ethereumToSubstrate(ethereumAddress);
        return substrateAddress;
    } catch (error) {
        console.error('Error converting address:', error.message);
        return null;
    }
};

// Main execution
const main = () => {
    // Get Ethereum address from command line argument
    const ethereumAddress = process.argv[2];

    if (!ethereumAddress) {
        console.error('Please provide an Ethereum address as an argument.');
        console.error('Usage: node ethereum-to-substrate-converter.js <ethereum_address>');
        process.exit(1);
    }

    const substrateAddress = convertEthereumToSubstrate(ethereumAddress);

    if (substrateAddress) {
        console.log('Ethereum Address:', ethereumAddress);
        console.log('Substrate Address:', substrateAddress);
    } else {
        console.error('Failed to convert address.');
    }
};

// Run the script
main();
