"use client";
import RetroGrid from "@/components/magicui/retro-grid";
import Navbar from "@/components/navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
        {children}
        <RetroGrid />
      </div>
    </>
  );
}
