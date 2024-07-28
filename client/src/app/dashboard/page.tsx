'use client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gauge, Zap, Shield, Crosshair } from 'lucide-react';

const retroBlue = 'hsl(210, 100%, 56%)';
const retroPink = 'hsl(331, 100%, 45%)';

export default function Dashboard() {
    return (
        <div className="py-8 px-4 md:px-6 max-w-7xl mx-auto text-white">
            <h1 className="text-5xl font-extrabold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#ff8a00] via-[#e52e71] to-[#ff8a00] retro-text-shadow">
                NeonDrive Racing League 🏁
            </h1>
            <p className="text-xl text-center mb-12 text-slate-300">Accelerate your gains in the Polkadot & Unique Network fast lane!</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <Card className="bg-slate-800 border-2 border-[${retroPink}] rounded-lg overflow-hidden retro-card-shadow">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-[${retroPink}] flex items-center gap-2">
                            <Gauge className="w-6 h-6" />
                            Turbo-Charged Pooling
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4">Join forces with other racers to pool your DOT and UNQ tokens. Bigger pool, higher rewards!</p>
                        <div className="flex items-center justify-center mb-4">
                            <img src="https://gateway.pinata.cloud/ipfs/QmbdDAaqEHj3WgM4RkBYcaLFRi2wiqMS2nZxLiDn7YwRFL" alt="Pooling Illustration" className="rounded-lg" />
                        </div>
                        <ul className="list-disc list-inside text-slate-300">
                            <li>Minimize gas fees</li>
                            <li>Increase chances of winning blocks</li>
                            <li>Share rewards proportionally</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card className="bg-slate-800 border-2 border-[${retroBlue}] rounded-lg overflow-hidden retro-card-shadow">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-[${retroBlue}] flex items-center gap-2">
                            <Zap className="w-6 h-6" />
                            Nitro Boost & Sabo-brakes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4">Unique twist: Buff yourself or debuff a random competitor for an edge in the race!</p>
                        <div className="flex items-center justify-center mb-4">
                            <img src="https://gateway.pinata.cloud/ipfs/Qmcj1b8poiRKkLyf3mCrHZsMGTcJw3j81Ner8S9UQYDbPF" alt="Buff/Debuff Illustration" className="rounded-lg" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Badge className="bg-green-500 mb-2">Buff 🚀</Badge>
                                <ul className="list-disc list-inside text-slate-300 text-sm">
                                    <li>Increase your rewards</li>
                                    <li>Boost your voting power</li>
                                </ul>
                            </div>
                            <div>
                                <Badge className="bg-red-500 mb-2">Debuff 🦔</Badge>
                                <ul className="list-disc list-inside text-slate-300 text-sm">
                                    <li>Slow down a competitor</li>
                                    <li>Reduce their voting power</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-slate-800 border-2 border-[${retroPink}] rounded-lg overflow-hidden retro-card-shadow mb-12">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-[${retroPink}] flex items-center gap-2">
                        <Shield className="w-6 h-6" />
                        How It Works
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ol className="list-decimal list-inside space-y-4 text-slate-300">
                        <li>Connect your Polkadot wallet to join the race 🏎️</li>
                        <li>Stake your DOT or UNQ tokens in the pool of your choice 💰</li>
                        <li>Earn rewards as your pool validates blocks and wins races 🏆</li>
                        <li>Use NOS (Nitro Optimization System) to buff yourself or debuff others 🛠️</li>
                        <li>Climb the leaderboard and become the ultimate crypto racer! 🏁</li>
                    </ol>
                </CardContent>
            </Card>

            <div className="text-center">
                <Button className="bg-gradient-to-r from-[${retroPink}] to-[${retroBlue}] text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 hover:brightness-110 retro-button">
                    <Crosshair className="w-5 h-5 mr-2" />
                    Start Your Engines!
                </Button>
            </div>
        </div>
    );
}
