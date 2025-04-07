import Link from "next/link"
import { Package, Search, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MainNav } from "@/components/main-nav"
import { ThemeToggle } from "@/components/theme-toggle"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav />
        <div className="flex flex-1 items-center space-x-4 sm:justify-end">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search clients or consignments..." className="pl-8" />
          </div>
          <Button variant="outline" size="icon" asChild>
            <Link href="/clients/new">
              <User className="h-4 w-4" />
              <span className="sr-only">Add Client</span>
            </Link>
          </Button>
          <Button variant="outline" size="icon" asChild>
            <Link href="/consignments/new">
              <Package className="h-4 w-4" />
              <span className="sr-only">Add Consignment</span>
            </Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

