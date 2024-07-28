import { Sdk, CHAIN_CONFIG, UnsignedTxPayloadBody, SignTxResultResponse } from '@unique-nft/sdk/full';
import { Signer, ethers } from 'ethers';

export const connectSdk = async (signer: Signer, substrateAddress: string) => {
    const sdk = new Sdk({
        baseUrl: CHAIN_CONFIG.opal.restUrl,
        signer: {
            address: substrateAddress,
            sign: async (unsignedTxPayload: UnsignedTxPayloadBody): Promise<SignTxResultResponse> => {
                // Convert the payload to a string
                const payloadString = JSON.stringify(unsignedTxPayload.signerPayloadJSON);

                // Sign the payload string
                const signatureBytes = await signer.signMessage(ethers.getBytes(payloadString));

                // Convert the signature to a hex string
                const signature = ethers.hexlify(signatureBytes);

                // Return the signature in the expected format
                return {
                    signature,
                    signatureType: 'ethereum',
                };
            },
        },
    });

    return { sdk };
};
