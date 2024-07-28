'use client';
import Navbar from '@/components/navbar';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-900 to-slate-800">
            <Navbar />
            <main className="flex-grow pt-16">{children}</main>
        </div>
    );
}
