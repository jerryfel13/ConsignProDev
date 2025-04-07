import Link from "next/link";
import { Package, Users, Boxes } from "lucide-react";

export function MainNav() {
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2">
        <Package className="h-6 w-6" />
        <span className="inline-block font-bold">ConsignPro</span>
      </Link>
      <nav className="flex gap-6">
        <Link
          href="/"
          className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Dashboard
        </Link>
        <Link
          href="/clients"
          className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <Users className="mr-1 h-4 w-4" />
          Clients
        </Link>
        <Link
          href="/consignments"
          className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <Package className="mr-1 h-4 w-4" />
          Consignments
        </Link>
        <Link
          href="/reports"
          className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Reports
        </Link>
      </nav>
    </div>
  );
}
