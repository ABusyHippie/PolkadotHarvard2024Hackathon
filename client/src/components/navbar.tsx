import Link from 'next/link';
import { Button } from '@/components/ui/button';

import { Mountain, Wallet } from 'lucide-react';

export default function Navbar() {
    return (
        <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6">
            <Link href="#" className="mr-6 hidden lg:flex" prefetch={false}>
                <Mountain className="h-6 w-6" />
                <span className="sr-only">Acme Inc</span>
            </Link>
            <nav className="ml-auto flex gap-4 sm:gap-6">
                <Button variant="outline">
                    <Wallet className="w-5 h-5 mr-2" />
                    Connect Wallet
                </Button>
            </nav>
        </header>
    );
}
