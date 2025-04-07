"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "Active" | "Inactive";
  address: string;
  isConsigner: boolean;
}

export default function EditClientPage() {
  const params = useParams();
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchClientData = async () => {
      try {
        // Simulated API call
        const mockClient: Client = {
          id: params.id as string,
          name: "Jane Doe",
          email: "jane.doe@example.com",
          phone: "(555) 123-4567",
          status: "Active",
          address: "123 Main St, City, State",
          isConsigner: false,
        };

        setClient(mockClient);
      } catch (error) {
        console.error("Error fetching client data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // TODO: Replace with actual API call
      console.log("Saving client data:", client);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect back to client view page
      router.push(`/clients/${params.id}`);
    } catch (error) {
      console.error("Error saving client data:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!client) {
    return <div>Client not found</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/clients/${params.id}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Edit Client</h1>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/clients/${params.id}`}>Cancel</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={client.name}
                  onChange={(e) =>
                    setClient({ ...client, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={client.email}
                  onChange={(e) =>
                    setClient({ ...client, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={client.phone}
                  onChange={(e) =>
                    setClient({ ...client, phone: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={client.status}
                  onValueChange={(value: "Active" | "Inactive") =>
                    setClient({ ...client, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="isConsigner">Consigner Status</Label>
                <div className="flex h-10 w-full items-center">
                  <Switch
                    id="isConsigner"
                    checked={client.isConsigner}
                    onCheckedChange={(checked) =>
                      setClient({ ...client, isConsigner: checked })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={client.address}
                onChange={(e) =>
                  setClient({ ...client, address: e.target.value })
                }
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/clients/${params.id}`)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
