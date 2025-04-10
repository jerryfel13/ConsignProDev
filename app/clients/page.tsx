"use client";

import { useState } from "react";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ClientsTable } from "@/components/clients-table";
import { AddClientModal } from "@/components/add-client-modal";

export default function ClientsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClientAdded = () => {
    console.log("New client added on page, refresh data here.");
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-center sm:text-left">
          Manage Clients
        </h1>
      </div>
      <ClientsTable />
      <AddClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onClientAdded={handleClientAdded}
      />
    </div>
  );
}
