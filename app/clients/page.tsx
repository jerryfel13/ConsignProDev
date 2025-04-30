"use client";

import { useEffect, useState } from "react";
import { ClientsTable } from "@/components/clients-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddClientModal } from "@/components/add-client-modal";
import axios from "axios";

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        
        if (!token) {
          throw new Error("No authentication token found. Please log in again.");
        }

        const response = await axios.get('/api/clients', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        console.log("API Response:", response.data);

        if (response.data.status?.success) {
          const formattedClients = response.data.data.map((c: any) => ({
            id: c.external_id,
            name: `${c.first_name} ${c.last_name}`,
            email: c.email,
            phone: c.contact_no || "",
            status: c.is_active ? "Active" : "Inactive",
            isConsignor: c.is_consignor || false,
            consignments: c.consignments_count || 0,
            totalValue: c.total_value || "",
          }));
          setClients(formattedClients);
        } else {
          setError(response.data.status?.message || "Failed to fetch clients");
        }
      } catch (err: any) {
        console.error("Error fetching clients:", err);
        setError(err.message || "Failed to fetch clients");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleClientAdded = (newClient: any) => {
    setClients((prev) => [...prev, newClient]);
  };


  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-destructive text-2xl mb-4">Error</div>
          <p className="text-muted-foreground">{error}</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container p-0 md:py-4 md:px-4 max-w-6xl mx-auto">
     
          <div className="space-y-4">
          
            <ClientsTable initialClients={clients} loading={isLoading} />
          </div>
        
      <AddClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onClientAdded={handleClientAdded}
      />
    </div>
  );
}
