import { changeAttribute } from "./utils/change-attribute.js";
import { connectSdk } from "./utils/connect-sdk.js";
import { getRandomInt } from "./utils/random.js";
import { Address } from "@unique-nft/sdk/utils";


const play = async () => {
  const args = process.argv.slice(2);
  if (args.length < 4) {
    console.error("run this command: node ./src/4-play.js {collectionId-cars} {collectionId-achievements} {tokenId-1} {tokenId-2}");
    process.exit(1);
  }

  const [carsCollectionId, achievementsCollectionId, tokenId1, tokenId2] = args;
  const {account, sdk} = await connectSdk();

  // Pick the winner 
  const random = getRandomInt(2);
  const [winner, loser] = random === 0 ? [tokenId1, tokenId2] : [tokenId2, tokenId1];
  console.log(`Winner is ${winner}`);

  // 
  let {nonce} = await sdk.common.getNonce(account);
  const transactions = [];

  ////////////////////////////////////////////////////////
  ///////////////////// WINNER CALLS /////////////////////
  ////////////////////////////////////////////////////////

  // 1. Increment Victories to Winner
  const winnerToken = await sdk.token.getV2({collectionId: carsCollectionId, tokenId: winner});
  const winnerVictories = winnerToken.attributes.find(a => a.trait_type === "Victories").value;

  transactions.push(sdk.token.setProperties({
    collectionId: carsCollectionId,
    tokenId: winner,
    // NOTICE: Attributes stored in "tokenData" property
    properties: [{
      key: "tokenData",
      value: changeAttribute(winnerToken, "Victories", winnerVictories + 1)
    }]
  }, { nonce: nonce++}));

  // 2. If this is the first win - give an achievment
  if (winnerVictories + 1 === 1) {
    transactions.push(sdk.token.createV2({
      collectionId: achievementsCollectionId,
      image: "https://gateway.pinata.cloud/ipfs/QmY7hbSNiwE3ApYp83CHWFdqrcEAM6AvChucBVA6kC1e8u",
      attributes: [{trait_type: "Bonus", value: 10}],
      // NOTICE: owner of the achievment NFT is car NFT
      owner: Address.nesting.idsToAddress(winnerToken.collectionId, winnerToken.tokenId),
    }, {nonce: nonce++}));
  }

  ////////////////////////////////////////////////////////
  ///////////////////// LOSER CALLS //////////////////////
  ////////////////////////////////////////////////////////

  const loserToken = await sdk.token.getV2({collectionId: carsCollectionId, tokenId: loser});
  const loserDefeats = loserToken.attributes.find(a => a.trait_type === "Defeats").value;

  // 3. Increment Defeats to Loser
  transactions.push(sdk.token.setProperties({
    collectionId: carsCollectionId,
    tokenId: loser,
    // NOTICE: Attributes stored in "tokenData" property
    properties: [{
      key: "tokenData",
      value: changeAttribute(loserToken, "Defeats", loserDefeats + 1)
    }]
  }, {nonce: nonce++}));

  // 4. If this is the first defeat - give an achievment
  if (loserDefeats + 1 === 1) {
    transactions.push(sdk.token.createV2({
      collectionId: achievementsCollectionId,
      image: "https://gateway.pinata.cloud/ipfs/QmP2pehdeJWNK8DMMoy7Fm9QoWHZ6As159NiZ6ZSrbb64o",
      attributes: [{trait_type: "Bonus", value: 5}],
      // NOTICE: owner of the achievment NFT is car NFT
      owner: Address.nesting.idsToAddress(loserToken.collectionId, loserToken.tokenId),
    }, {nonce: nonce++}));
  }

  await Promise.all(transactions);

  console.log(`TokenID ${winner} has ${winnerVictories + 1} wins`);
  console.log(`TokenID ${loser} has ${loserDefeats + 1} defeats`);

  console.log(`Winner: https://uniquescan.io/opal/tokens/${carsCollectionId}/${winner}`);
  console.log(`Loser: https://uniquescan.io/opal/tokens/${carsCollectionId}/${loser}`);

  process.exit(0);
}

play().catch(e => {
  console.log("Something went wrong during play");
  throw e;
})