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
import { Toaster, toast } from "react-hot-toast";

interface Client {
  external_id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  suffix?: string;
  email: string;
  contact_no: string;
  address?: string;
  is_active: boolean;
  is_consignor: boolean;
  bank?: {
    account_name: string;
    account_no: string;
    bank: string;
  } | null;
  birth_date?: string;
  instagram?: string;
  facebook?: string;
}

export default function EditClientPage() {
  const params = useParams();
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found.");
        const id = params?.id as string;
        const response = await fetch(`/api/clients?id=${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (data.status?.success) {
          setClient(data.data);
        } else {
          setClient(null);
        }
      } catch (error) {
        console.error("Error fetching client data:", error);
        setClient(null);
      } finally {
        setLoading(false);
      }
    };
    if (params?.id) fetchClientData();
  }, [params?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authentication token found.");
        setSaving(false);
        return;
      }
      const userExternalId = localStorage.getItem("user_external_id");
      if (!userExternalId) {
        toast.error("No user external_id found. Please log in again.");
        setSaving(false);
        return;
      }
      const id = params?.id as string;
      if (!id) {
        toast.error("No client id found in URL.");
        setSaving(false);
        return;
      }
      if (client?.is_consignor && !client.bank) {
        toast.error("Bank information is required for consignors.");
        setSaving(false);
        return;
      }
      const payload = {
        first_name: client?.first_name,
        middle_name: client?.middle_name || null,
        last_name: client?.last_name,
        suffix: client?.suffix || null,
        birth_date: client?.birth_date || null,
        email: client?.email,
        contact_no: client?.contact_no || null,
        address: client?.address || null,
        instagram: client?.instagram || null,
        facebook: client?.facebook || null,
        is_consignor: client?.is_consignor,
        bank: client?.is_consignor ? client?.bank : null,
        updated_by: userExternalId,
      };
      const response = await fetch(`/api/clients/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (data.status?.success) {
        toast.success("Client successfully updated!");
        setTimeout(() => {
          router.push(`/clients/${id}`);
        }, 1200);
      } else {
        toast.error(data.status?.message || "Failed to update client");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update client");
      console.error("Error saving client data:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading client information...</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return <div>Client not found</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <Toaster />
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/clients/${params?.id}`}>
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
          <Link href={`/clients/${params?.id}`}>Cancel</Link>
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
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={client.first_name ?? ''}
                  onChange={(e) => setClient({ ...client, first_name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={client.last_name ?? ''}
                  onChange={(e) => setClient({ ...client, last_name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="middle_name">Middle Name</Label>
                <Input
                  id="middle_name"
                  value={client.middle_name ?? ''}
                  onChange={(e) => setClient({ ...client, middle_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="suffix">Suffix</Label>
                <Input
                  id="suffix"
                  value={client.suffix ?? ''}
                  onChange={(e) => setClient({ ...client, suffix: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={client.email ?? ''}
                  onChange={(e) => setClient({ ...client, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_no">Phone</Label>
                <Input
                  id="contact_no"
                  value={client.contact_no ?? ''}
                  onChange={(e) => setClient({ ...client, contact_no: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={client.is_active ? "Active" : "Inactive"}
                  onValueChange={(value: "Active" | "Inactive") =>
                    setClient({ ...client, is_active: value === "Active" })
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
                <Label htmlFor="is_consignor">Consignor Status</Label>
                <div className="flex h-10 w-full items-center">
                  <Switch
                    id="is_consignor"
                    checked={client.is_consignor}
                    onCheckedChange={(checked) =>
                      setClient({ ...client, is_consignor: checked })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={client.address || ''}
                  onChange={(e) => setClient({ ...client, address: e.target.value })}
                />
              </div>
              {client.is_consignor && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="bank_account_name">Bank Account Name</Label>
                    <Input
                      id="bank_account_name"
                      value={client.bank?.account_name ?? ''}
                      onChange={e => setClient({
                        ...client,
                        bank: {
                          ...client.bank,
                          account_name: e.target.value ?? '',
                          account_no: client.bank?.account_no ?? '',
                          bank: client.bank?.bank ?? '',
                        }
                      })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bank_account_no">Bank Account Number</Label>
                    <Input
                      id="bank_account_no"
                      value={client.bank?.account_no ?? ''}
                      onChange={e => setClient({
                        ...client,
                        bank: {
                          ...client.bank,
                          account_name: client.bank?.account_name ?? '',
                          account_no: e.target.value ?? '',
                          bank: client.bank?.bank ?? '',
                        }
                      })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bank_bank">Bank Name</Label>
                    <Input
                      id="bank_bank"
                      value={client.bank?.bank ?? ''}
                      onChange={e => setClient({
                        ...client,
                        bank: {
                          ...client.bank,
                          account_name: client.bank?.account_name ?? '',
                          account_no: client.bank?.account_no ?? '',
                          bank: e.target.value ?? '',
                        }
                      })}
                      required
                    />
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/clients/${params?.id}`)}
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
