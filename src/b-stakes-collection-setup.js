import { connectSdk } from './utils/connect-sdk.js';
import { ethers } from 'ethers';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';
import { u8aToHex } from '@polkadot/util';

const VAULT_ABI = ['function stake() external payable', 'function getStake(address user) external view returns (uint256)'];

const checkCollectionAdmin = async (sdk, address, collectionId) => {
    try {
        const collection = await sdk.collections.get({ collectionId });
        const isAdmin = collection.admins.includes(address);
        console.log(`Is account admin for collection ${collectionId}: ${isAdmin}`);
        return isAdmin;
    } catch (error) {
        console.error(`Error checking admin status for collection ${collectionId}:`, error);
        return false;
    }
};

const stakeOPL = async (stakeAmount, userAddress) => {
    try {
        const { account, sdk } = await connectSdk();
        console.log('Connected to SDK successfully');
        console.log('SDK account address:', account.address);
        console.log('User provided address:', userAddress);

        const vaultContractAddress = '0xb96707196e8c299b583f989d11d3a664cc48c31e';
        const vaultCollectionId = 3319;
        const vaultTokenId = 1;
        const stakesCollectionId = 3321; // Make sure this matches the ID from the collection creation script

        // Check if the account is an admin of the stakes collection
        const isAdmin = await checkCollectionAdmin(sdk, account.address, stakesCollectionId);
        if (!isAdmin) {
            console.log('The account is not an admin of the stakes collection.');
            console.log('Please ensure the account has admin permissions before proceeding.');
            return;
        }

        // Convert stake amount to the correct format (assuming 18 decimals for OPL)
        const stakeAmountInWei = ethers.parseUnits(stakeAmount.toString(), 18);
        console.log(`Stake amount in Wei: ${stakeAmountInWei.toString()}`);

        // Convert Substrate address to Ethereum-style address
        const substratePublicKey = decodeAddress(account.address);
        const ethereumAddress = u8aToHex(substratePublicKey).slice(0, 42);
        console.log(`Ethereum-style address: ${ethereumAddress}`);

        // Encode the function call
        const iface = new ethers.Interface(VAULT_ABI);
        const encodedData = iface.encodeFunctionData('stake');
        console.log(`Encoded function data: ${encodedData}`);

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
        const stakeResult = await sdk.extrinsics.submitWaitResult({
            address: account.address,
            section: 'evm',
            method: 'call',
            args: [
                ethereumAddress,
                vaultContractAddress,
                stakeAmountInWei.toString(),
                '2000000',
                null,
                null,
                null,
                encodedData,
                false,
            ],
        });

        console.log(`Staked ${stakeAmount} OPL tokens. Transaction hash: ${stakeResult.hash}`);

        // Create stake NFT
        console.log('Creating stake NFT...');
        try {
            const tokenTx = await sdk.tokens.create.submitWaitResult({
                address: account.address,
                collectionId: stakesCollectionId,
                properties: [
                    {
                        key: 'tokenData',
                        value: JSON.stringify({
                            vaultId: vaultTokenId.toString(),
                            stakeAmount: stakeAmount,
                            stakeTimestamp: Date.now().toString(),
                        }),
                    },
                ],
            });

            console.log('NFT creation transaction submitted:', tokenTx);

            if (tokenTx.error) {
                throw new Error(`NFT creation failed: ${tokenTx.error.message}`);
            }

            const tokenId = tokenTx.tokenId;
            if (!tokenId) throw new Error('Cannot parse token ID');

            console.log(`Stake NFT created: https://uniquescan.io/opal/tokens/${stakesCollectionId}/${tokenId}`);

            // Update vault's total staked amount
            console.log('Updating vault\'s total staked amount...');
            const vaultToken = await sdk.tokens.get({ collectionId: vaultCollectionId, tokenId: vaultTokenId });
            const currentStaked = vaultToken.properties.find((p) => p.key === 'Total Staked')?.value ?? '0';

            await sdk.tokens.setProperties.submitWaitResult({
                address: account.address,
                collectionId: vaultCollectionId,
                tokenId: vaultTokenId,
                properties: [
                    {
                        key: 'Total Staked',
                        value: (parseFloat(currentStaked) + parseFloat(stakeAmount)).toString(),
                    },
                ],
            });

            console.log(`Updated Vault NFT: https://uniquescan.io/opal/tokens/${vaultCollectionId}/${vaultTokenId}`);
        } catch (nftError) {
            console.error('Error during NFT creation:', nftError.message);
            console.log('Staking was successful, but NFT creation failed. Please contact support to resolve this issue.');
        }

    } catch (error) {
        console.error('An error occurred during the staking process:', error.message);
    }
};

// Usage: node stake-opl-script.js 100 5CPueZjQ49oV5suHKZWP1Dpou3kX6RgTjvDkzoaMENGU1zyn
const [stakeAmount, userAddress] = process.argv.slice(2);
stakeOPL(stakeAmount, userAddress).catch(console.error);