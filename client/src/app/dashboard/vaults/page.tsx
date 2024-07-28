'use client';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Gauge, Trophy, Zap } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

const retroBlue = 'hsl(210, 100%, 56%)';
const retroPink = 'hsl(331, 100%, 45%)';

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

    const filteredGarages = garageData.filter((garage) => garage.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleStake = (garageName: string) => {
        setSelectedGarage(garageName);
        setIsStakeModalOpen(true);
    };

    const confirmStake = () => {
        // Here you would typically interact with your smart contract to stake the tokens
        console.log(`Staking ${stakeAmount} tokens in ${selectedGarage}`);
        setIsStakeModalOpen(false);
        setStakeAmount('');
        setSelectedGarage(null);
    };

    return (
        <main className="py-8 px-4 md:px-6 max-w-7xl mx-auto bg-gradient-to-b from-slate-900 to-slate-800 text-white">
            <h1 className="text-5xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#ff8a00] via-[#e52e71] to-[#ff8a00] retro-text-shadow">
                Unique Garage 🏁
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
                            onClick={confirmStake}
                            className={`bg-gradient-to-r from-[${retroPink}] to-[${retroBlue}] text-white hover:brightness-110 transition-all duration-300 retro-button`}
                        >
                            Confirm Stake 🚀
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </main>
    );
}
