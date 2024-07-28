'use client';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Gauge, Trophy, Zap } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

const retroBlue = 'hsl(210, 100%, 56%)';
const retroPink = 'hsl(331, 100%, 45%)';

const VAULT_ABI = [
    {
        inputs: [
            {
                internalType: 'address',
                name: 'initialOwner',
                type: 'address',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
        ],
        name: 'OwnableInvalidOwner',
        type: 'error',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'OwnableUnauthorizedAccount',
        type: 'error',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'previousOwner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'OwnershipTransferred',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'user',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'Staked',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'user',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'Unstaked',
        type: 'event',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'user',
                type: 'address',
            },
        ],
        name: 'getStake',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'owner',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'renounceOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'stake',
        outputs: [],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        name: 'stakes',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'totalStaked',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'newOwner',
                type: 'address',
            },
        ],
        name: 'transferOwnership',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'unstake',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];

const garageData = [
    { name: 'Neon Nitro', prize: '1000 UNQ', chance: '5%', deposits: '10000 UNQ', icon: '🚀' },
    { name: 'Retro Racer', prize: '500 QTZ', chance: '10%', deposits: '5000 QTZ', icon: '🏎️' },
    { name: 'Pixel Pursuit', prize: '10000 OPAL', chance: '2%', deposits: '100000 OPAL', icon: '👾' },
];

interface GarageCardProps {
    garage: any;
    index: number;
    onStake: (garageName: string) => void;
}

interface HandleStakeProps {
    signer: ethers.Signer;
    sdk: Sdk;
    stakeAmount: string; // Numerical string, e.g. "1.5"
    userAddress: string;
    vaultTokenId: number;
}

import { useWallet } from '@/hooks/useWallet';
import { connectSdk } from '@/lib/connectSDK';
import { ethers } from 'ethers';
import { Sdk, SignTxResultResponse, UnsignedTxPayloadResponse } from '@unique-nft/sdk/full';

const GarageCard: React.FC<GarageCardProps> = ({ garage, index, onStake }) => (
    <Card className={`bg-slate-800 border-2 border-[${index % 2 === 0 ? retroPink : retroBlue}] rounded-lg overflow-hidden retro-card-shadow`}>
        <div className="h-32 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
            <span className="text-6xl">{garage.icon}</span>
        </div>
        <CardContent className="pt-6">
            <CardTitle className={`text-xl mb-2 text-[${index % 2 === 0 ? retroPink : retroBlue}]`}>{garage.name}</CardTitle>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-400">Prize Pool</span>
                    <Badge variant="secondary" className="bg-slate-700 text-white">
                        {garage.prize}
                    </Badge>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-400">Victory Chance</span>
                    <div className="flex items-center">
                        <Trophy className="w-4 h-4 mr-1 text-yellow-500" />
                        <span className="text-white">{garage.chance}</span>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-400">Total Fuel</span>
                    <div className="flex items-center">
                        <Gauge className="w-4 h-4 mr-1 text-green-500" />
                        <span className="text-white">{garage.deposits}</span>
                    </div>
                </div>
            </div>
        </CardContent>
        <CardFooter>
            <Button
                className={`w-full bg-gradient-to-r from-[${retroPink}] to-[${retroBlue}] text-white hover:brightness-110 transition-all duration-300 retro-button`}
                onClick={() => onStake(garage.name)}
            >
                Fuel Up 🔥
            </Button>
        </CardFooter>
    </Card>
);

export default function Vaults() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);
    const [selectedGarage, setSelectedGarage] = useState<string | null>(null);
    const [stakeAmount, setStakeAmount] = useState('');
    const { signer, substrateAddress } = useWallet();

    const filteredGarages = garageData.filter((garage) => garage.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleStake = (garageName: string) => {
        setSelectedGarage(garageName);
        setIsStakeModalOpen(true);
    };

    const submitStake = async () => {
        if (signer && substrateAddress && selectedGarage && stakeAmount) {
            const { sdk } = await connectSdk(signer, substrateAddress);

            // Convert stake amount to wei
            const stakeAmountWei = ethers.parseEther(stakeAmount);
            // Create contract instance
            const vaultContract = new ethers.Contract('0xB058e27BFE2e835D44b1b6CC185F10e5ba0c7b38', VAULT_ABI, signer);
            console.log('Staking...');
            // Call the stake function
            const stakeTx = await vaultContract.stake({ value: stakeAmountWei });

            // Wait for the transaction to be mined
            await stakeTx.wait();
            console.log('Stake successful');

            console.log('Creating stake NFT...');
            const createTokenArgs = {
                address: substrateAddress,
                collectionId: 3321,
                owner: substrateAddress,
                attributes: [
                    {
                        trait_type: 'Vault ID',
                        value: 1,
                    },
                    {
                        trait_type: 'Stake Amount',
                        value: parseInt(stakeAmount),
                    },
                    {
                        trait_type: 'Stake Timestamp',
                        value: Date.now(),
                    },
                ],
            };

            // Step 1: Build the unsigned transaction
            const unsignedTx: UnsignedTxPayloadResponse = await sdk.token.createV2.build(createTokenArgs);

            // Step 2: Sign the transaction
            const signCallback = async (unsignedTxPayload: UnsignedTxPayloadResponse): Promise<SignTxResultResponse> => {
                const payloadBytes = ethers.toUtf8Bytes(JSON.stringify(unsignedTxPayload.signerPayloadJSON));
                const signature = await signer.signMessage(payloadBytes);
                return {
                    signature,
                    signatureType: 'ethereum',
                };
            };

            const signedTx = await signCallback(unsignedTx);

            // Step 3: Submit the transaction
            const tokenTx = await sdk.token.createV2.submit({
                ...unsignedTx,
                signature: signedTx.signature,
            });
            console.log(`Transaction submitted. Hash: ${tokenTx.hash}`);
            setStakeAmount('');
            setIsStakeModalOpen(false);
        }
    };

    useEffect(() => {
        const fetchVaults = async () => {
            if (signer && substrateAddress) {
                const { sdk } = await connectSdk(signer, substrateAddress);
                const vaults = await sdk.collection.getV2({ collectionId: 3319 });
                console.log(vaults);
            }
        };
        fetchVaults();
    }, [signer, substrateAddress]);

    return (
        <main className="py-8 px-4 md:px-6 max-w-7xl mx-auto bg-gradient-to-b from-slate-900 to-slate-800 text-white">
            <h1 className="text-5xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#ff8a00] via-[#e52e71] to-[#ff8a00] retro-text-shadow">
                Neon Garage 🏁
            </h1>
            <div className="mb-8 relative">
                <Input
                    type="text"
                    placeholder="Search racing teams... 🔍"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`pl-10 pr-4 py-2 w-full rounded-lg border-2 border-[${retroPink}] bg-slate-800 text-white focus:ring-2 focus:ring-[${retroBlue}] focus:border-transparent`}
                />
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-[${retroPink}]`} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredGarages.map((garage, index) => (
                    <GarageCard key={index} garage={garage} index={index} onStake={handleStake} />
                ))}
            </div>

            <Dialog open={isStakeModalOpen} onOpenChange={setIsStakeModalOpen}>
                <DialogContent className={`bg-slate-800 border-2 border-[${retroPink}] text-white`}>
                    <DialogHeader>
                        <DialogTitle className={`text-2xl font-bold text-[${retroPink}]`}>Fuel Up Your Ride</DialogTitle>
                        <DialogDescription className="text-slate-300">Enter the amount of tokens you want to stake in {selectedGarage}.</DialogDescription>
                    </DialogHeader>
                    <Input
                        type="number"
                        placeholder="Enter stake amount"
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        className={`bg-slate-700 border-[${retroBlue}] text-white`}
                    />
                    <DialogFooter>
                        <Button
                            className={`bg-gradient-to-r from-[${retroPink}] to-[${retroBlue}] text-white hover:brightness-110 transition-all duration-300 retro-button`}
                            onClick={() => submitStake()}
                        >
                            Confirm Stake 🚀
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </main>
    );
}
