import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { LogIn, Menu } from "lucide-react";

export default function Navbar() {
  return (
    <header className="flex h-16 items-center justify-between px-4 md:px-6">
      <Link href="#" className="flex items-center gap-2" prefetch={false}>
        <LogIn className="h-6 w-6" />
        <span className="sr-only">Acme Inc</span>
      </Link>
      <nav className="hidden items-center gap-6 md:flex">
        <Link href="#" className="text-sm font-medium transition-colors hover:text-primary" prefetch={false}>
          Prizes
        </Link>
        <Link href="#" className="text-sm font-medium transition-colors hover:text-primary" prefetch={false}>
          Vault
        </Link>
        <Link href="#" className="text-sm font-medium transition-colors hover:text-primary" prefetch={false}>
          Account
        </Link>
      </nav>
      <Button className="hidden md:inline-flex">Connect Wallet</Button>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle navigation</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <div className="grid gap-4 p-4">
            <Link href="#" className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary" prefetch={false}>
              Prizes
            </Link>
            <Link href="#" className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary" prefetch={false}>
              Vault
            </Link>
            <Link href="#" className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary" prefetch={false}>
              Account
            </Link>
            <Button className="w-full">Connect Wallet</Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
