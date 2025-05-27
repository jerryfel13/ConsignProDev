"use client";

import { useEffect, useState } from "react";
import { ClientsTable } from "@/components/clients-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddClientModal } from "@/components/add-client-modal";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const fetchClients = async () => {
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

  if (!response.data.status?.success) {
    throw new Error(response.data.status?.message || "Failed to fetch clients");
  }

  return response.data.data.map((c: any) => ({
    id: c.external_id,
    name: `${c.first_name} ${c.last_name}`,
    email: c.email,
    phone: c.contact_no || "",
    status: c.is_active ? "Active" : "Inactive",
    isConsignor: c.is_consignor || false,
    consignments: c.consignments_count || 0,
    totalValue: c.total_value || "",
  }));
};

export default function ClientsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { 
    data: clients = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['clients'],
    queryFn: fetchClients,
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    retry: 2, // Retry failed requests twice
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });

  const handleClientAdded = (newClient: any) => {
    queryClient.setQueryData(['clients'], (old: any[] = []) => [...old, newClient]);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-destructive text-2xl mb-4">Error</div>
          <p className="text-muted-foreground">{error instanceof Error ? error.message : "Failed to fetch clients"}</p>
          <Button variant="outline" className="mt-4" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container p-0 md:py-4 md:px-4 max-w-6xl mx-auto">
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <ClientsTable initialClients={clients} loading={isLoading} />
        )}
      </div>
      <AddClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onClientAdded={handleClientAdded}
      />
    </div>
  );
}
