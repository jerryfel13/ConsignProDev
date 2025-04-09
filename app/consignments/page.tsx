import Link from "next/link";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ConsignmentsTable } from "@/components/consignments-table";

export default function ConsignmentsPage() {
  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <h1 className="text-xl sm:text-2xl font-bold">Consignments</h1>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/consignments/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Consignment
          </Link>
        </Button>
      </div>
      <ConsignmentsTable />
    </div>
  );
}
