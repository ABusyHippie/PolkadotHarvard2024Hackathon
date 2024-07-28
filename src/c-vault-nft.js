import { connectSdk } from './utils/connect-sdk.js';
import { getRandomInt } from './utils/random.js';

// node ./src/create-vault-nft.js {collectionId} {vaultName} {initialPrize}
// i.e. node ./src/create-vault-nft.js 3131 "Daily Draw" 1000
const createVault = async () => {
    const args = process.argv.slice(2);
    if (args.length < 3) {
        console.error('run this command: node ./src/create-vault-nft.js {collectionId} {vaultName} {initialPrize}');
        process.exit(1);
    }

    const [collectionId, vaultName, initialPrize] = args;

    const { account, sdk } = await connectSdk();

    // Get pseudo-random vault image for fun
    const vaultImage = (() => {
        const rand = getRandomInt(3);
        if (rand === 0) {
            return 'https://gateway.pinata.cloud/ipfs/QmbdDAaqEHj3WgM4RkBYcaLFRi2wiqMS2nZxLiDn7YwRFL';
        } else if (rand === 1) {
            return 'https://gateway.pinata.cloud/ipfs/Qmcj1b8poiRKkLyf3mCrHZsMGTcJw3j81Ner8S9UQYDbPF';
        } else {
            return 'https://gateway.pinata.cloud/ipfs/QmerxFiJgChjfBxu4ANshQqADVSbsWm1chJJMTCn4Bqot6';
        }
    })();

    const tokenTx = await sdk.token.createV2({
        collectionId,
        image: vaultImage,
        attributes: [
            {
                trait_type: 'Vault Name',
                value: vaultName,
            },
            {
                trait_type: 'Total Staked',
                value: 0,
            },
            {
                trait_type: 'Prize Pool',
                value: parseInt(initialPrize),
            },
            {
                trait_type: 'Last Draw Timestamp',
                value: Date.now(),
            },
        ],
    });

    const token = tokenTx.parsed;
    if (!token) throw Error('Cannot parse token');

    console.log(`Explore your Vault NFT: https://uniquescan.io/opal/tokens/${token.collectionId}/${token.tokenId}`);

    process.exit(0);
};

createVault().catch((e) => {
    console.log('Something went wrong during vault creation');
    throw e;
});
