import Link from "next/link";
import { Package, Users, Boxes } from "lucide-react";

export function MainNav() {
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2 text-white">
        <Package className="h-6 w-6" />
        <span className="inline-block font-bold">CRCMS</span>
      </Link>
      <nav className="flex gap-6">
        <Link
          href="/"
          className="flex items-center text-sm font-medium text-white transition-colors hover:text-white/80"
        >
          Dashboard
        </Link>
        <Link
          href="/clients"
          className="flex items-center text-sm font-medium text-white transition-colors hover:text-white/80"
        >
          <Users className="mr-1 h-4 w-4" />
          Clients
        </Link>
        <Link
          href="/consignments"
          className="flex items-center text-sm font-medium text-white transition-colors hover:text-white/80"
        >
          <Package className="mr-1 h-4 w-4" />
          Consignments
        </Link>
        <Link
          href="/reports"
          className="flex items-center text-sm font-medium text-white transition-colors hover:text-white/80"
        >
          Reports
        </Link>
      </nav>
    </div>
  );
}
