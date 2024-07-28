import { useState, useEffect } from 'react';
import { BrowserProvider, Signer } from 'ethers';
import { Address } from '@unique-nft/utils';

declare global {
    interface Window {
        ethereum?: any;
    }
}
export function useWallet() {
    const [ethereumAddress, setEthereumAddress] = useState<string | null>(null);
    const [substrateAddress, setSubstrateAddress] = useState<string | null>(null);
    const [provider, setProvider] = useState<BrowserProvider | null>(null);
    const [signer, setSigner] = useState<Signer | null>(null);

    const convertEthereumToSubstrate = (ethereumAddress: string) => {
        try {
            const substrateAddress = Address.mirror.ethereumToSubstrate(ethereumAddress);
            return substrateAddress;
        } catch (error: any) {
            console.error('Error converting address:', error.message);
            return null;
        }
    };

    const connectWallet = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                await window.ethereum.request({ method: 'eth_requestAccounts' });

                const provider = new BrowserProvider(window.ethereum);
                setProvider(provider);

                const signer = await provider.getSigner();
                setSigner(signer);

                const address = await signer.getAddress();
                setEthereumAddress(address);

                const substrateAddr = convertEthereumToSubstrate(address);
                setSubstrateAddress(substrateAddr);

                window.ethereum.on('accountsChanged', async (accounts: string[]) => {
                    setEthereumAddress(accounts[0]);
                    const substrateAddr = convertEthereumToSubstrate(accounts[0]);
                    setSubstrateAddress(substrateAddr);
                    setSigner(await provider.getSigner());
                });

                window.ethereum.on('chainChanged', () => {
                    window.location.reload();
                });
            } catch (error) {
                console.error('Failed to connect to MetaMask', error);
            }
        } else {
            console.error('MetaMask is not installed');
        }
    };

    useEffect(() => {
        connectWallet();
    }, []);

    return { ethereumAddress, substrateAddress, provider, signer, connectWallet };
}
