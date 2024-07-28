import { changeAttribute } from "./utils/change-attribute.js";
import { connectSdk } from "./utils/connect-sdk.js";
import { getRandomInt } from "./utils/random.js";
import { Address } from "@unique-nft/sdk/utils";

const play = async () => {
  const args = process.argv.slice(2);
  if (args.length < 3) {
    console.error("run this command: node ./src/4-play.js {collectionId-cars} {collectionId-achievements} {tokenId-1} {tokenId-2} ... {tokenId-n}");
    process.exit(1);
  }

  const [carsCollectionId, achievementsCollectionId, ...tokenIds] = args;
  const {account, sdk} = await connectSdk();

  // Pick the winner 
  const winnerIndex = getRandomInt(tokenIds.length);
  const winner = tokenIds[winnerIndex];
  console.log(`Winner is ${winner}`);

  let {nonce} = await sdk.common.getNonce(account);
  const transactions = [];

  ////////////////////////////////////////////////////////
  ///////////////////// WINNER CALLS /////////////////////
  ////////////////////////////////////////////////////////

  const winnerToken = await sdk.token.getV2({collectionId: carsCollectionId, tokenId: winner});
  const winnerVictories = winnerToken.attributes.find(a => a.trait_type === "Victories").value;

  // 2. If this is the first win - give an achievement
  if (winnerVictories + 1 === 1) {
    transactions.push(sdk.token.createV2({
      collectionId: achievementsCollectionId,
      image: "https://gateway.pinata.cloud/ipfs/QmSEK7Vua2QbTXrN8GPzRZC7ZumxteZBwjdXnvaY3tzVDU",
      attributes: [{trait_type: "Bonus", value: 10}],
      owner: Address.nesting.idsToAddress(winnerToken.collectionId, winnerToken.tokenId),
    }, {nonce: nonce++}));
  }

  ////////////////////////////////////////////////////////
  ///////////////////// EXPERIENCE CALLS //////////////////////
  ////////////////////////////////////////////////////////

  for (const tokenId of tokenIds) {
      const playerToken = await sdk.token.getV2({collectionId: carsCollectionId, tokenId});
      const playerExps = playerToken.attributes.find(a => a.trait_type === "Experience").value;

      if(tokenId == winner){
        // 3. Increment Experiences to participant
      transactions.push(sdk.token.setProperties({
        collectionId: carsCollectionId,
        tokenId,
        // NOTICE: Attributes stored in "tokenData" property
        properties: [{
          key: "tokenData",
          value: changeAttribute(playerToken, "Experience", playerExps + 1)
        },
        {
          key: "tokenData",
          value: changeAttribute(winnerToken, "Victories", winnerVictories + 1)
        }
      ]
      }, {nonce: nonce++}));
      }
      else{
        // 3. Increment Experiences to participant
      transactions.push(sdk.token.setProperties({
        collectionId: carsCollectionId,
        tokenId,
        // NOTICE: Attributes stored in "tokenData" property
        properties: [{
          key: "tokenData",
          value: changeAttribute(playerToken, "Experience", playerExps + 1)
        }]
      }, {nonce: nonce++}));
      }

      // 4. If this is the first experience - give an achievement
      if (playerExps + 1 === 1) {
        transactions.push(sdk.token.createV2({
          collectionId: achievementsCollectionId,
          image: "https://gateway.pinata.cloud/ipfs/QmepSRHQNtjQmwfUeDetsq7a7HMRAUPoFtrVoCHWy9Nz2V",
          attributes: [{trait_type: "Bonus", value: 5}],
          // NOTICE: owner of the achievement NFT is car NFT
          owner: Address.nesting.idsToAddress(playerToken.collectionId, playerToken.tokenId),
        }, {nonce: nonce++}));
      }
  }

  await Promise.all(transactions);

  console.log(`TokenID ${winner} has ${winnerVictories + 1} wins`);

  for (const tokenId of tokenIds) {
    const playerToken = await sdk.token.getV2({collectionId: carsCollectionId, tokenId});
    const playerExps = playerToken.attributes.find(a => a.trait_type === "Experience").value;
    console.log(`TokenID ${tokenId} has ${playerExps} experiences`);
  }

  console.log(`Winner: https://uniquescan.io/opal/tokens/${carsCollectionId}/${winner}`);
  for (const tokenId of tokenIds) {
    if (tokenId !== winner) {
      console.log(`Player: https://uniquescan.io/opal/tokens/${carsCollectionId}/${tokenId}`);
    }
  }

  process.exit(0);
}

play().catch(e => {
  console.log("Something went wrong during play");
  throw e;
})