import { connectSdk } from './utils/connect-sdk.js';
import { ethers } from 'ethers';
import { Address } from '@unique-nft/utils';

const VAULT_ABI = ['function stake() external payable'];

const stakeOPL = async (stakeAmount, userAddress, stakesCollectionId, vaultCollectionId, vaultTokenId, vaultContractAddress) => {
    try {
        const { account, sdk } = await connectSdk();
        console.log('Connected to SDK successfully');
        console.log('SDK account address:', account.address);
        console.log('User provided address:', userAddress);

        // Convert stake amount to the correct format (assuming 18 decimals for OPL)
        const stakeAmountInWei = ethers.parseUnits(stakeAmount.toString(), 18);
        console.log(`Stake amount in Wei: ${stakeAmountInWei.toString()}`);

        // Convert Substrate address to Ethereum address
        const ethereumAddress = Address.mirror.substrateToEthereum(account.address);
        console.log(`Ethereum-style address: ${ethereumAddress}`);

        // Check balance before staking
        const balance = await sdk.balance.get({ address: account.address });
        console.log(`Account balance: ${balance.availableBalance.amount}`);

        // Convert balance to BigInt for comparison
        const balanceInWei = ethers.parseUnits(balance.availableBalance.amount, 18);
        console.log(`Account balance in Wei: ${balanceInWei.toString()}`);

        if (balanceInWei < stakeAmountInWei) {
            throw new Error('Insufficient balance to stake the requested amount');
        }

        // Stake OPL tokens
        // console.log('Attempting to stake OPL tokens...');
        // const stakeResult = await sdk.extrinsics.submitWaitResult({
        //     address: account.address,
        //     section: 'evm',
        //     method: 'call',
        //     args: [
        //         ethereumAddress,
        //         vaultContractAddress,
        //         stakeAmountInWei.toString(),
        //         '2000000',
        //         null,
        //         null,
        //         null,
        //         ethers.id('stake()').slice(0, 10), // Function selector for stake()
        //         false,
        //     ],
        // });

        // console.log(`Staked ${stakeAmount} OPL tokens. Transaction hash: ${stakeResult.hash}`);

        // Create stake NFT
        console.log('Creating stake NFT...');
        const tokenTx = await sdk.token.createV2({
            address: account.address,
            collectionId: stakesCollectionId,
            owner: userAddress,
            attributes: [
                {
                    trait_type: 'Vault ID',
                    value: vaultTokenId,
                },
                {
                    trait_type: 'Stake Amount',
                    value: parseInt(stakeAmount),
                },
                {
                    trait_type: 'Stake Timestamp',
                    value: Date.now(),
                },
            ],
        });

        const token = tokenTx.parsed;
        if (!token) throw Error('Cannot parse token');

        console.log(`Stake NFT created: https://uniquescan.io/opal/tokens/${token.collectionId}/${token.tokenId}`);
    } catch (error) {
        console.error('An error occurred during the staking process:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
    }
};

// Usage: node updated-stake-opl-script.js 100 5CPueZjQ49oV5suHKZWP1Dpou3kX6RgTjvDkzoaMENGU1zyn 3321 3319 1 0xYourVaultContractAddress
const [stakeAmount, userAddress, stakesCollectionId, vaultCollectionId, vaultTokenId, vaultContractAddress] = process.argv.slice(2);
stakeOPL(stakeAmount, userAddress, stakesCollectionId, vaultCollectionId, vaultTokenId, vaultContractAddress).catch(console.error);
