# Winner's Circle Demo

This codebase allows you to launch a winner's circle circuit, create players, and run races to find the staked rewards victor.

### Before we start

- Create a Substrate account
- Get `OPL` (testnet) tokens: https://t.me/unique2faucet_opal_bot
- Create `.env` from `.env-example` and set your mnemonic phrase
- Run `npm install`

## How it works
Winner's circle is a game for winner's only! Stake your crypto, generate yield rewards, have a chance to win a prize. Unstake at anytime, no losses!

<img src="./images/img1.png">

Join a staking pool and get a Dynamic player NFT which you can then augment with Nested NFTs that allow you to race with cars with better traits, give you "wheels" which improve your odds of winning the current pool, or "spikes" which sabotage other players. When you win a prize pool your `Victories` counter increases, and for each pool you "race" in the `Experience` counter increments.

<img src="./images/img2.png">

Winner's of each race get a unique achievement NFT with the gold medal for your specific race, as well as the staking prize pool of yield rewards!

<img src="./images/img3.png">

### Talking about features

- All NFTs are owned by individual users
- The application can modify NFT properties
- Users can modify the properties of their NFTs by purchasing nested NFTs

---


## 1. Create a winner's circle collection

```sh
node ./src/1-collection-cars.js
```

## 2. Create Achievements collection

```sh
node ./src/2-collection-achievement.js
```

## 3. Create at least two winner NFTs

Pass the following arguments to the function
- collectionId (step 1)
- owner Substrate address
- owner nickname

For example:

```sh
node ./src/3-create-car.js 3135 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY EZsoFastBrrr
node ./src/3-create-car.js 3135 5CPuU98SimxwoHZRZCi8hezgnfBwATs8vKo6haqkaP3hUj7X BartFTW
```

## 4. Play the game

Pass the following arguments to the function
- Winner's Circle circuit collectionId (step 1)
- Achievements collectionId (step 2)
- First player's tokenId 
- Second player's tokenId

```sh
node ./src/4-play.js 3132 3133 1 2
```