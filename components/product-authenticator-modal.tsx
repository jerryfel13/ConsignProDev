"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface ProductAuthenticatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticatorAdded: (authenticator: { external_id: string; name: string }) => void;
}

export function ProductAuthenticatorModal({
  isOpen,
  onClose,
  onAuthenticatorAdded,
}: ProductAuthenticatorModalProps) {
  const [authenticatorName, setAuthenticatorName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authenticatorName.trim()) {
      setError("Authenticator name is required");
      return;
    }

    if (authenticatorName.length > 100) {
      setError("Authenticator name must not exceed 100 characters");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      onAuthenticatorAdded({ external_id: "", name: authenticatorName });
      setAuthenticatorName("");
      onClose();
    } catch (error) {
      setError("Failed to create authenticator");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Authenticator</DialogTitle>
          <DialogDescription>
            Create a new product authenticator. The authenticator name must be unique.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="authenticatorName">Authenticator Name</Label>
            <Input
              id="authenticatorName"
              value={authenticatorName}
              onChange={(e) => setAuthenticatorName(e.target.value)}
              placeholder="Enter authenticator name"
              maxLength={100}
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Plus className="mr-2 h-4 w-4" />
              {isSubmitting ? "Adding..." : "Add Authenticator"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 