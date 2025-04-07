import { Badge } from "@/components/ui/badge"

export function RecentConsignments() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <div className="space-y-1">
          <p className="text-sm font-medium leading-none">Antique Furniture Set</p>
          <p className="text-sm text-muted-foreground">Client: Jane Doe</p>
        </div>
        <div className="ml-auto font-medium">
          <Badge>New</Badge>
        </div>
      </div>
      <div className="flex items-center">
        <div className="space-y-1">
          <p className="text-sm font-medium leading-none">Vintage Watch Collection</p>
          <p className="text-sm text-muted-foreground">Client: Robert Johnson</p>
        </div>
        <div className="ml-auto font-medium">
          <Badge variant="secondary">Processing</Badge>
        </div>
      </div>
      <div className="flex items-center">
        <div className="space-y-1">
          <p className="text-sm font-medium leading-none">Art Deco Jewelry</p>
          <p className="text-sm text-muted-foreground">Client: Alice Smith</p>
        </div>
        <div className="ml-auto font-medium">
          <Badge variant="outline">Listed</Badge>
        </div>
      </div>
      <div className="flex items-center">
        <div className="space-y-1">
          <p className="text-sm font-medium leading-none">Rare Book Collection</p>
          <p className="text-sm text-muted-foreground">Client: Michael Brown</p>
        </div>
        <div className="ml-auto font-medium">
          <Badge variant="destructive">Sold</Badge>
        </div>
      </div>
    </div>
  )
}

