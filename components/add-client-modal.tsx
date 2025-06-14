"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Save } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { BankDetailsModal } from "@/components/bank-details-modal"; // Assuming this is correctly located
import { clientApi } from "@/lib/api";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
}

// Define the form schema (updated)
const formSchema = z.object({
  first_name: z
    .string()
    .min(1, "First name is required")
    .max(100, "First name must be at most 100 characters"),
  middle_name: z
    .string()
    .max(100, "Middle name must be at most 100 characters")
    .optional(),
  last_name: z
    .string()
    .min(1, "Last name is required")
    .max(100, "Last name must be at most 100 characters"),
  suffix: z.string().max(10, "Suffix must be at most 10 characters").optional(),
  birth_date: z.string().min(1, "Birth date is required"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(100, "Email must be at most 100 characters")
    .optional()
    .or(z.literal("")),
  contact_no: z
    .string()
    .min(1, "Contact number is required")
    .max(100, "Contact number must be at most 100 characters"),
  address: z.string().optional(),
  instagram: z
    .string()
    .min(1, "Instagram handle is required")
    .max(100, "Instagram handle must be at most 100 characters"),
  facebook: z
    .string()
    .max(100, "Facebook profile must be at most 100 characters")
    .optional(),
  is_consignor: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientAdded: (newClient: Client) => void;
}

export function AddClientModal({
  isOpen,
  onClose,
  onClientAdded,
}: AddClientModalProps) {
  const router = useRouter(); // Keep for potential future use, but might not navigate directly
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [bankDetails, setBankDetails] = useState<{
    account_name: string;
    account_no: string;
    bank: string;
  } | null>(null);
  const [showSuccessPrompt, setShowSuccessPrompt] = useState(false);
  const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [pendingSuccessPrompt, setPendingSuccessPrompt] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      first_name: "",
      middle_name: "",
      last_name: "",
      suffix: "",
      birth_date: "",
      email: "",
      contact_no: "",
      address: "",
      instagram: "",
      facebook: "",
      is_consignor: false,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);

    try {
      // Check for token
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You are not authenticated. Please log in again.");
        setIsSubmitting(false);
        return;
      }
      // Optionally, check if token is expired (basic check for JWT)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp && Date.now() >= payload.exp * 1000) {
          toast.error("Session expired. Please log in again.");
          setIsSubmitting(false);
          return;
        }
      } catch (e) {
        // If token is not a valid JWT, treat as invalid
        toast.error("Invalid session. Please log in again.");
        setIsSubmitting(false);
        return;
      }

      // Only include bank if is_consignor is true
      let bankField = undefined;
      if (values.is_consignor) {
        bankField = bankDetails
          ? {
              account_name: bankDetails.account_name,
              account_no: bankDetails.account_no,
              bank: bankDetails.bank,
            }
          : {};
      }
      // Get the logged-in user's external_id from localStorage
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const clientData = {
        first_name: values.first_name,
        middle_name: values.middle_name || "",
        last_name: values.last_name,
        suffix: values.suffix || "",
        birth_date: values.birth_date,
        email: values.email,
        contact_no: values.contact_no || "",
        address: values.address || "",
        instagram: values.instagram || "",
        facebook: values.facebook || "",
        is_consignor: values.is_consignor,
        bank: values.is_consignor
          ? {
              account_name: bankDetails?.account_name || "",
              account_no: bankDetails?.account_no || "",
              bank: bankDetails?.bank || ""
            }
          : null,
        created_by: userData.external_id || "",
      };
      console.log("Submitting clientData:", clientData);

      const response = await axios.post(
        '/api/clients',
        clientData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      // Reset form, close modal, and trigger callback
      form.reset();
      setBankDetails(null);
      // Map API response to table's expected client shape
      const apiClient = response.data.data;
      const mappedClient = {
        id: apiClient.external_id,
        name: `${apiClient.first_name} ${apiClient.last_name}`.trim(),
        email: apiClient.email,
        phone: apiClient.contact_no,
        status: apiClient.status || (apiClient.is_active ? "Active" : "Inactive"),
        isConsignor: apiClient.is_consignor,
        consignments: apiClient.consignments_count || 0,
      };
      onClientAdded(mappedClient);
      setPendingSuccessPrompt(true);
      onClose();
      console.log("Client added successfully:", response);
    } catch (error: any) {
      console.error("Failed to submit client:", error);
      if (error.response && error.response.data) {
        console.error("API Error Data:", error.response.data);
        const apiMessage =
          error.response.data.status?.message ||
          error.response.data.message ||
          JSON.stringify(error.response.data) ||
          "Unknown error";
        toast.error(apiMessage);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBankDetailsSave = (data: {
    account_name: string;
    account_no: string;
    bank: string;
  }) => {
    setBankDetails(data);
    // Don't force is_Consignor to true here; let the switch handle it.
    // The presence of bankDetails can imply Consignor status upon submission.
    setShowBankModal(false);
  };

  // This function now only closes the bank modal.
  // The switch's onCheckedChange directly handles the field value.
  const handleBankModalClose = () => {
    setShowBankModal(false);
    // If the user closes the bank modal without saving,
    // ensure the is_Consignor switch reflects this if needed.
    // Check if bankDetails are still null. If so, set is_Consignor back to false.
    if (!bankDetails) {
      form.setValue("is_consignor", false, { shouldValidate: true });
    }
  };

  // Move reset logic into useEffect
  useEffect(() => {
    if (!isOpen && form.formState.isDirty) {
      form.reset();
      setBankDetails(null);
    }
  }, [isOpen, form, setBankDetails]);

  // Show the success prompt after the modal is closed
  useEffect(() => {
    if (!isOpen && pendingSuccessPrompt) {
      setShowSuccessPrompt(true);
      setPendingSuccessPrompt(false);
      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
      successTimeoutRef.current = setTimeout(() => {
        setShowSuccessPrompt(false);
      }, 1500);
    }
  }, [isOpen, pendingSuccessPrompt]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>
              Enter the details for the new client record. Click save when done.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 px-1 py-4"
            >
              {/* Form Fields - Copied from app/clients/new/page.tsx */}
              {/* Arrange them appropriately within the modal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        First Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter first name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="middle_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Middle Name (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter middle name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Last Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="suffix"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Suffix (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter suffix" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="birth_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Birth Date <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          placeholder="MM-DD-YYYY"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contact_no"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Contact Number <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter contact number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Instagram <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Instagram handle"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="facebook"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facebook (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Facebook profile"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter address"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <FormField
                  control={form.control}
                  name="is_consignor"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Is Consignor</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            if (checked) {
                              setShowBankModal(true);
                            } else {
                              setBankDetails(null);
                            }
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Save className="mr-2 h-4 w-4" />
                      Save Client
                    </span>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Render BankDetailsModal conditionally */}
      {showBankModal && (
        <BankDetailsModal
          isOpen={showBankModal}
          onClose={handleBankModalClose}
          onSave={handleBankDetailsSave}
          // Pass external_id only if it exists and is needed.
          // It might be better to collect bank details without depending on external_id yet.
          clientExtId={""}
        />
      )}

      {/* Success Prompt Modal */}
      {showSuccessPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 w-[90vw] max-w-sm flex flex-col items-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <svg
                className="w-6 h-6 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="text-center font-medium text-lg text-gray-900 mb-1">
              Client Added
            </h4>
            <p className="text-center text-gray-600 mb-2">
              The client was added successfully!
            </p>
          </div>
        </div>
      )}
    </>
  );
}
