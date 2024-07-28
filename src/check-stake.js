import { connectSdk } from './utils/connect-sdk.js';
import { ethers } from 'ethers';
import { Address } from '@unique-nft/utils';

const VAULT_ABI = ['function totalStaked() view returns (uint256)', 'function getStake(address user) view returns (uint256)'];

const checkStake = async (userAddress, vaultContractAddress) => {
    try {
        const { account, sdk } = await connectSdk();
        console.log('Connected to SDK successfully');

        // Convert Substrate address to Ethereum address
        const ethereumAddress = Address.mirror.substrateToEthereum(userAddress);
        console.log(`Ethereum-style address: ${ethereumAddress}`);

        // Create contract instance
        const provider = new ethers.JsonRpcProvider('https://rpc-opal.unique.network');
        const contract = new ethers.Contract(vaultContractAddress, VAULT_ABI, provider);

        // Get total staked
        const totalStaked = await contract.totalStaked();
        console.log(`Total Staked: ${ethers.formatEther(totalStaked)} OPL`);

        // Get user's stake
        const userStake = await contract.getStake(ethereumAddress);
        console.log(`User Stake: ${ethers.formatEther(userStake)} OPL`);
    } catch (error) {
        console.error('An error occurred:', error.message);
    }
};

// Usage: node check-stake-script.js 5CPueZjQ49oV5suHKZWP1Dpou3kX6RgTjvDkzoaMENGU1zyn 0xYourVaultContractAddress
const [userAddress, vaultContractAddress] = process.argv.slice(2);
checkStake(userAddress, vaultContractAddress).catch(console.error);
