import Link from "next/link"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ConsignmentsTable } from "@/components/consignments-table"

export default function ConsignmentsPage() {
  return (
    <div className="flex flex-col p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Consignments</h1>
        <Button asChild>
          <Link href="/consignments/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Consignment
          </Link>
        </Button>
      </div>
      <ConsignmentsTable />
    </div>
  )
}

