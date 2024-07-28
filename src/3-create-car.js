import { connectSdk } from "./utils/connect-sdk.js";
import { getRandomInt } from "./utils/random.js";


// node ./src/create-token.js {collectionId} {address} {nickname}
// i.e. node ./src/create-token.js 3131 5HRADyd2sEVtpqh3cCdTdvfshMV7oK4xXJyM48i4r9S3TNGH Speedy777
const createToken = async () => {
  const args = process.argv.slice(2);
  if (args.length < 3) {
    console.error("run this command: node ./src/3-create-car.js {collectionId} {address} {nickname}");
    process.exit(1);
  }

  const [collectionId, owner, nickname] = args;

  const {account, sdk} = await connectSdk();

  // Get pseudo-random car image for fun
  const tokenImage = (() => {
    const rand = getRandomInt(3);
    if (rand === 0) {
        return "https://gateway.pinata.cloud/ipfs/QmXDktxoDApFot8rvfA2uLbn2HCLyszpcNNFnaNrUha9Re";
    } else if (rand === 1) {
        return "https://gateway.pinata.cloud/ipfs/QmRZqAMReL8PLGSDV4KwrgrnzSKEXcokR55uqmKBtCE6TH";
    } else {
        return "https://gateway.pinata.cloud/ipfs/QmV8CUsVhYX4C5QoBZ2grixcxWYQQuayynJpv3vbPijMFV";
    }
})();

  const tokenTx = await sdk.token.createV2({
    collectionId,
    image: tokenImage,
    owner,
    attributes: [
      {
        trait_type: "Nickname",
        value: nickname,
      },
      {
        trait_type: "Victories",
        value: 0,
      },
      {
        trait_type: "Defeats",
        value: 0,
      }
    ],
  });

  const token = tokenTx.parsed;
  if (!token) throw Error("Cannot parse token");

  console.log(`Explore your NFT: https://uniquescan.io/opal/tokens/${token.collectionId}/${token.tokenId}`);
 
  process.exit(0);
}


createToken().catch(e => {
  console.log('Something wrong during token creation');
  throw e;
});
