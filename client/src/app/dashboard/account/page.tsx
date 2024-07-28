'use client';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Gauge, Trophy, Users, Zap, Shield, Rocket } from 'lucide-react';

const retroBlue = 'hsl(210, 100%, 56%)';
const retroPink = 'hsl(331, 100%, 45%)';

export default function AccountPage() {
    return (
        <main className="py-8 px-4 md:px-6 max-w-7xl mx-auto bg-gradient-to-b from-slate-900 to-slate-800 text-white">
            <h1 className="text-5xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#ff8a00] via-[#e52e71] to-[#ff8a00] retro-text-shadow">
                Your Dashboard
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {[
                    { title: 'Speed', value: '2,345.67 UNQ', subtitle: 'Staked Amount', icon: Gauge, color: retroPink },
                    { title: 'Victories', value: '567.89 UNQ', subtitle: 'Total Winnings', icon: Trophy, color: retroBlue },
                    { title: 'Crew', value: '123.45 UNQ', subtitle: 'Referral Bonus', icon: Users, color: retroPink },
                ].map((stat, index) => (
                    <Card key={index} className={`bg-slate-800 border-2 border-[${stat.color}] rounded-lg overflow-hidden retro-card-shadow`}>
                        <CardHeader className="bg-gradient-to-r from-slate-700 to-slate-800 pb-2">
                            <CardTitle className="text-lg font-bold flex items-center">
                                <stat.icon className="w-6 h-6 mr-2" style={{ color: stat.color }} />
                                {stat.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="text-3xl font-bold" style={{ color: stat.color }}>
                                {stat.value}
                            </div>
                            <p className="text-sm text-slate-400">{stat.subtitle}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <h2 className="text-3xl font-bold mb-6 text-center bg-clip-text text-white bg-gradient-to-r from-[${retroBlue}] to-[${retroPink}] retro-text-shadow">Turbo Boosters</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                    {
                        title: 'Throttle',
                        description: 'Increase your winning chances by 25% and another racer by 10%',
                        price: '50 UNQ',
                        icon: <Zap className="w-12 h-12" style={{ color: retroPink }} />,
                    },
                    {
                        title: 'Defend',
                        description: "Randomly decrease another racer's winning chances by 25%",
                        price: '40 UNQ',
                        icon: <Shield className="w-12 h-12" style={{ color: retroBlue }} />,
                    },
                    {
                        title: 'Nitro',
                        description: 'Boost your winning chances by 15%',
                        price: '30 UNQ',
                        icon: <Rocket className="w-12 h-12" style={{ color: retroPink }} />,
                    },
                ].map((booster, index) => (
                    <Card key={index} className={`bg-slate-800 border-2 border-[${index % 2 === 0 ? retroPink : retroBlue}] rounded-lg overflow-hidden retro-card-shadow`}>
                        <div className="h-32 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">{booster.icon}</div>
                        <CardContent className="pt-6">
                            <CardTitle className={`text-xl mb-2 text-[${index % 2 === 0 ? retroPink : retroBlue}]`}>{booster.title}</CardTitle>
                            <p className="text-sm text-slate-400 mb-4">{booster.description}</p>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className={`w-full bg-gradient-to-r from-[${retroPink}] to-[${retroBlue}] text-white hover:brightness-110 transition-all duration-300 retro-button`}
                            >
                                Fuel Up - {booster.price}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </main>
    );
}
