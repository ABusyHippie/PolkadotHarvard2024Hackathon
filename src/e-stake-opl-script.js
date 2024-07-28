import { connectSdk } from './utils/connect-sdk.js';
import { ethers } from 'ethers';
import { Address } from '@unique-nft/utils';

const VAULT_ABI = [
    {
        inputs: [
            {
                internalType: 'address',
                name: 'initialOwner',
                type: 'address',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'OwnableInvalidOwner',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'OwnableUnauthorizedAccount',
        type: 'error',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'previousOwner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'OwnershipTransferred',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'user',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'Staked',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'user',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'Unstaked',
        type: 'event',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'user',
                type: 'address',
            },
        ],
        name: 'getStake',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'owner',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'renounceOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'stake',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        name: 'stakes',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'totalStaked',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'unstake',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];

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
        console.log('Attempting to stake OPL tokens...');
        const stakeResult = await sdk.evm.call({
            contractAddress: vaultContractAddress,
            funcName: 'stake',
            abi: VAULT_ABI,
            value: stakeAmountInWei.toString(),
        });
        const evmEvents = evmTxResult.parsed?.parsedEvents;
        console.log('EVM events:', evmEvents);
        console.log(`Staked ${stakeAmount} OPL tokens. Transaction hash: ${stakeResult.hash}`);

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
