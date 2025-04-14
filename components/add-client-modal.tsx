"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Save } from "lucide-react";

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
    .max(100, "Email must be at most 100 characters"),
  contact_no: z
    .string()
    .max(100, "Contact number must be at most 100 characters")
    .optional(),
  address: z.string().optional(),
  instagram: z
    .string()
    .max(100, "Instagram handle must be at most 100 characters")
    .optional(),
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
  onClientAdded?: () => void; // Optional callback after successful addition
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

    // Include bank details if they exist
    const submissionData = {
      ...values,
      bank_details: bankDetails, // Add bank details to the submission
    };

    console.log("Submitting new client:", submissionData);

    // Replace with your actual API call
    try {
      // const response = await fetch('/api/clients', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(submissionData),
      // });
      // if (!response.ok) throw new Error('Failed to add client');
      // const newClient = await response.json();
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      // Reset form, close modal, and trigger callback
      form.reset();
      setBankDetails(null);
      onClose();
      onClientAdded?.(); // Call the callback if provided

      console.log("Client added successfully");
      // Optionally show a success toast/notification here
    } catch (error) {
      console.error("Failed to submit client:", error);
      // Handle error display to the user (e.g., show an error message in the modal)
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

  // Reset form state when the modal is closed externally
  if (!isOpen && form.formState.isDirty) {
    form.reset();
    setBankDetails(null);
  }

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
                      <FormLabel>
                        Email <span className="text-red-500">*</span>
                      </FormLabel>
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
                      <FormLabel>Contact Number (Optional)</FormLabel>
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
                      <FormLabel>Instagram (Optional)</FormLabel>
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
    </>
  );
}
