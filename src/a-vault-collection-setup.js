import { connectSdk } from './utils/connect-sdk.js';

const createVaultCollection = async () => {
    const { account, sdk } = await connectSdk();

    // 1. Let's check account's balance
    const balance = await sdk.balance.get(account);
    console.log(`${account.address} balance:`, balance.availableBalance.formatted);

    // 2. Mint collection for vaults
    const { parsed } = await sdk.collection.createV2({
        name: 'PoolTogether Vaults',
        description: 'Collection of vaults for PoolTogether clone',
        symbol: 'PTVAULT',
        cover_image: { url: 'https://picsum.photos/200/300' },
        permissions: { nesting: { collectionAdmin: true } },
        encodeOptions: {
            overwriteTPPs: [
                {
                    key: 'tokenData',
                    permission: {
                        collectionAdmin: true,
                        tokenOwner: false,
                        mutable: true,
                    },
                },
            ],
        },
    });

    if (!parsed) throw Error('Cannot parse minted collection');

    const collectionId = parsed.collectionId;
    console.log('Vault Collection ID:', collectionId);
    console.log(`Explore your collection: https://uniquescan.io/opal/collections/${collectionId}`);

    process.exit(0);
};

createVaultCollection().catch((e) => {
    console.log('Something went wrong during vault collection creation');
    throw e;
});
