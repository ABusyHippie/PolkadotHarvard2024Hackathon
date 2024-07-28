import { connectSdk } from './utils/connect-sdk.js';

// node ./src/create-stake-nft.js {stakesCollectionId} {vaultCollectionId} {vaultTokenId} {stakeAmount} {userAddress}
// i.e. node ./src/create-stake-nft.js 3132 3131 1 100 5HRADyd2sEVtpqh3cCdTdvfshMV7oK4xXJyM48i4r9S3TNGH
const createStake = async () => {
    const args = process.argv.slice(2);
    if (args.length < 5) {
        console.error('run this command: node ./src/create-stake-nft.js {stakesCollectionId} {vaultCollectionId} {vaultTokenId} {stakeAmount} {userAddress}');
        process.exit(1);
    }

    const [stakesCollectionId, vaultCollectionId, vaultTokenId, stakeAmount, userAddress] = args;

    const { account, sdk } = await connectSdk();

    // First, update the vault's total staked amount
    const vaultToken = await sdk.token.getV2({ collectionId: vaultCollectionId, tokenId: vaultTokenId });
    const currentStaked = vaultToken.attributes.find((a) => a.trait_type === 'Total Staked').value;

    await sdk.token.setProperties({
        collectionId: vaultCollectionId,
        tokenId: vaultTokenId,
        properties: [
            {
                key: 'tokenData',
                value: JSON.stringify({
                    attributes: [
                        ...vaultToken.attributes.filter((a) => a.trait_type !== 'Total Staked'),
                        {
                            trait_type: 'Total Staked',
                            value: currentStaked + parseInt(stakeAmount),
                        },
                    ],
                }),
            },
        ],
    });

    // Now create the stake NFT
    const tokenTx = await sdk.token.createV2({
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

    console.log(`Explore your Stake NFT: https://uniquescan.io/opal/tokens/${token.collectionId}/${token.tokenId}`);

    process.exit(0);
};

createStake().catch((e) => {
    console.log('Something went wrong during stake creation');
    throw e;
});
