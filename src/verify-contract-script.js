import { connectSdk } from "./utils/connect-sdk.js";
import { ethers } from 'ethers';

const VAULT_ABI = [
    "function getStake(address user) external view returns (uint256)"
];

const verifyContract = async () => {
  const {account, sdk} = await connectSdk();

  const vaultContractAddress = "0xda79a1f04d303bc7f166ad4821133cd3fb68858a";

  try {
    // Encode the function call
    const iface = new ethers.utils.Interface(VAULT_ABI);
    const encodedData = iface.encodeFunctionData("getStake", [account.address]);

    // Try to read the contract state
    const result = await sdk.extrinsics.submitWaitResult({
      address: account.address,
      section: 'evm',
      method: 'call',
      args: [
        account.address,       // sender
        vaultContractAddress,  // contract address
        '0',                   // value
        '1000000',             // gas limit
        null,                  // max fee per gas (null for automatic)
        null,                  // max priority fee per gas (null for automatic)
        null,                  // nonce (null for automatic)
        encodedData,           // input data
        false                  // estimate flag
      ]
    });

    console.log("Contract verification successful. Result:", result);
  } catch (error) {
    console.error("Error verifying contract:", error);
  }
};

verifyContract().catch(console.error);