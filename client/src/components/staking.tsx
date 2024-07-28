import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { Send } from 'lucide-react';

export default function StakingCard() {
    return (
        <main className="flex-1">
            <section className="flex flex-col items-center justify-center gap-6 py-12">
                <div className="flex flex-col items-center gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">Crypto Staking</h1>
                    <p className="text-muted-foreground">Stake your crypto and earn rewards.</p>
                </div>
                <div className="flex gap-4">
                    <Input type="number" placeholder="Amount to stake" className="max-w-xs" />
                    <Button>
                        <Send className="w-5 h-5 mr-2" />
                        Stake
                    </Button>
                </div>
            </section>
        </main>
    );
}
