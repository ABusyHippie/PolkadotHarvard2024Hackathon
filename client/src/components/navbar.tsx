// components/Navbar.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { GaugeCircle, Trophy, User, Menu, Wallet } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';

const retroBlue = 'hsl(210, 100%, 56%)';
const retroPink = 'hsl(331, 100%, 45%)';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const { ethereumAddress, connectWallet } = useWallet();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const truncateAddress = (addr: string) => {
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-slate-900/80 backdrop-blur-md shadow-md' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                <Link href="/" className="flex items-center gap-2">
                    <div className={`bg-gradient-to-r from-[${retroPink}] to-[${retroBlue}] p-2 rounded-full`}>
                        <GaugeCircle className="h-6 w-6 text-white" />
                    </div>
                    <span className={`font-bold text-xl bg-clip-text text-white retro-text-shadow`}>NeonDrive</span>
                </Link>
                <nav className="hidden items-center gap-6 md:flex">
                    {[
                        { name: 'Races', href: '/dashboard', icon: Trophy },
                        { name: 'Garage', href: '/dashboard/vaults', icon: GaugeCircle },
                        { name: 'Driver', href: '/dashboard/account', icon: User },
                    ].map((item) => (
                        <Link key={item.name} href={item.href} className={`text-sm font-medium transition-colors hover:text-[${retroPink}] flex items-center gap-1`}>
                            <item.icon className="h-4 w-4" />
                            {item.name}
                        </Link>
                    ))}
                </nav>
                <Button
                    className={`hidden md:inline-flex bg-gradient-to-r from-[${retroPink}] to-[${retroBlue}] text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 hover:brightness-110 retro-button`}
                    onClick={connectWallet}
                >
                    {ethereumAddress ? (
                        <>
                            <Wallet className="w-4 h-4 mr-2" />
                            {truncateAddress(ethereumAddress)}
                        </>
                    ) : (
                        <>
                            <Wallet className="w-4 h-4 mr-2" />
                            Start Engine
                        </>
                    )}
                </Button>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className={`md:hidden bg-slate-800 border-[${retroPink}]`}>
                            <Menu className={`h-6 w-6 text-[${retroPink}]`} />
                            <span className="sr-only">Toggle navigation</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className={`w-[300px] sm:w-[400px] bg-slate-900 border-r-2 border-[${retroPink}]`}>
                        <div className="grid gap-4 py-4">
                            {[
                                { name: 'Races', href: '/dashboard', icon: Trophy },
                                { name: 'Garage', href: '/vaults', icon: GaugeCircle },
                                { name: 'Driver', href: '/account', icon: User },
                            ].map((item) => (
                                <Link key={item.name} href={item.href} className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-[${retroPink}]`}>
                                    <item.icon className="h-5 w-5" />
                                    {item.name}
                                </Link>
                            ))}
                            <Button
                                className={`w-full bg-gradient-to-r from-[${retroPink}] to-[${retroBlue}] text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 hover:brightness-110 retro-button`}
                                onClick={connectWallet}
                            >
                                {ethereumAddress ? truncateAddress(ethereumAddress) : 'Start Engine'}
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}
