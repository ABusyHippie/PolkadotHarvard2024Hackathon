// hooks/useWallet.ts
import { useState, useEffect } from 'react';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { ApiPromise, WsProvider } from '@polkadot/api';

export function useWallet() {
    const [address, setAddress] = useState<string | null>(null);
    const [api, setApi] = useState<ApiPromise | null>(null);

    const connectWallet = async () => {
        const extensions = await web3Enable('NeonDrive Racing League');
        if (extensions.length === 0) {
            console.error('No extension found');
            return;
        }

        const allAccounts = await web3Accounts();
        if (allAccounts.length > 0) {
            setAddress(allAccounts[0].address);
        }

        if (!api) {
            const wsProvider = new WsProvider('wss://unique-rpc.dwellir.com');
            const newApi = await ApiPromise.create({ provider: wsProvider });
            setApi(newApi);
        }
    };

    useEffect(() => {
        connectWallet();
    }, []);

    return { address, api, connectWallet };
}
