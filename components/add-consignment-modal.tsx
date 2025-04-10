"use client";

import { useState, useRef, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Tag, Upload, Save } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Schema remains largely the same, but external_id is removed
const formSchema = z.object({
  client_ext_id: z.string().min(1, { message: "Client ID is required." }),
  consignment_date: z
    .string()
    .min(1, { message: "Consignment date is required." }),
  brand: z.string().min(1, { message: "Brand is required." }),
  model: z.string().min(1, { message: "Model is required." }),
  code: z.string().min(1, { message: "Code is required." }),
  color: z.string().min(1, { message: "Color is required." }),
  size: z.string().min(1, { message: "Size is required." }),
  inclusion: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(), // Representing file names for now
  condition: z.string().min(1, { message: "Condition is required." }),
  selling_price: z.string().min(1, { message: "Selling price is required." }),
  authentication_status: z
    .string()
    .min(1, { message: "Authentication status is required." }),
  item_status: z.string().min(1, { message: "Item status is required." }),
  is_rejected: z.boolean().default(false), // Handled implicitly by item_status 'X'
  reject_reason: z.string().optional(),
  sold_to: z.string().optional(), // This might be handled separately after sale
  date_sold: z.string().optional(), // This might be handled separately after sale
  // is_active: z.boolean().default(true), // Removed, assume active unless status indicates otherwise
  created_by: z.string().min(1, { message: "Created by is required." }), // Should come from auth
});

type FormValues = z.infer<typeof formSchema>;

// Sample client data - in a real app, this would be fetched or passed in
// TODO: Replace with actual client data fetching/passing
const clients = [
  { id: "1", name: "Jane Doe" },
  { id: "2", name: "Robert Johnson" },
  { id: "3", name: "Alice Smith" },
  { id: "4", name: "Michael Brown" },
  { id: "5", name: "Emily Wilson" },
  { id: "7", name: "Sarah Johnson" },
  { id: "8", name: "Thomas Clark" },
  { id: "9", name: "Jennifer Adams" },
];

// Suggested inclusions
const suggestedInclusions = [
  "Dust Bag",
  "Box",
  "Receipts",
  "Authentication Cards",
  "Warranty Card",
  "Straps",
  "Care Instructions",
];

interface AddConsignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConsignmentAdded?: () => void;
  initialClientId?: string | null; // To pre-select client
}

export function AddConsignmentModal({
  isOpen,
  onClose,
  onConsignmentAdded,
  initialClientId,
}: AddConsignmentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newInclusion, setNewInclusion] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    // Default values set here, potentially overridden by initialClientId useEffect
    defaultValues: {
      client_ext_id: "",
      consignment_date: new Date().toISOString().split("T")[0],
      brand: "",
      model: "",
      code: "",
      color: "",
      size: "",
      inclusion: [],
      images: [],
      condition: "",
      selling_price: "",
      authentication_status: "Pending",
      item_status: "A", // Default to Available
      reject_reason: "",
      sold_to: "",
      date_sold: "",
      created_by: "admin", // TODO: Replace with actual user identifier
    },
  });

  // Update client ID if initialClientId changes (e.g., modal reopened for different client)
  useEffect(() => {
    if (initialClientId) {
      form.setValue("client_ext_id", initialClientId);
    } else {
      // Reset if no initial client ID is provided when opening
      form.setValue("client_ext_id", "");
    }
    // Only run when initialClientId changes or modal opens/closes (represented by isOpen)
  }, [initialClientId, isOpen, form]);

  // Watch the item_status field for conditional rendering
  const itemStatus = form.watch("item_status");

  // --- Inclusion Logic ---
  const handleAddInclusion = () => {
    if (newInclusion.trim()) {
      const currentInclusions = form.getValues("inclusion") || [];
      if (!currentInclusions.includes(newInclusion.trim())) {
        form.setValue("inclusion", [...currentInclusions, newInclusion.trim()]);
        setNewInclusion("");
      }
    }
  };
  const handleAddSuggestedInclusion = (inclusion: string) => {
    const currentInclusions = form.getValues("inclusion") || [];
    if (!currentInclusions.includes(inclusion)) {
      form.setValue("inclusion", [...currentInclusions, inclusion]);
    }
  };
  const handleRemoveInclusion = (inclusionToRemove: string) => {
    const currentInclusions = form.getValues("inclusion") || [];
    form.setValue(
      "inclusion",
      currentInclusions.filter((inclusion) => inclusion !== inclusionToRemove)
    );
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddInclusion();
    }
  };

  // --- Image Upload Logic ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // In a real app, you'd upload files here and store URLs/identifiers
      const fileNames = Array.from(e.target.files).map((file) => file.name);
      const currentImages = form.getValues("images") || [];
      form.setValue("images", [...currentImages, ...fileNames]);
      // Reset the file input value so the same file can be selected again if removed
      if (e.target) e.target.value = "";
    }
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // In a real app, you'd upload files here and store URLs/identifiers
      const fileNames = Array.from(e.dataTransfer.files).map(
        (file) => file.name
      );
      const currentImages = form.getValues("images") || [];
      form.setValue("images", [...currentImages, ...fileNames]);
    }
  };
  const removeImage = (imageToRemove: string) => {
    const currentImages = form.getValues("images") || [];
    form.setValue(
      "images",
      currentImages.filter((image) => image !== imageToRemove)
    );
  };
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  // --- Form Submission ---
  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    setIsSubmitting(true);

    // Add implicit is_rejected based on item_status
    const submissionData = {
      ...values,
      is_rejected: values.item_status === "X",
      // Ensure reject_reason is empty if not rejected
      reject_reason: values.item_status === "X" ? values.reject_reason : "",
    };

    console.log("Submitting new consignment:", submissionData);

    // Replace with your actual API call
    try {
      // const response = await fetch('/api/consignments', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(submissionData),
      // });
      // if (!response.ok) throw new Error('Failed to add consignment');
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      form.reset(); // Reset form to defaults
      onClose(); // Close the modal
      onConsignmentAdded?.(); // Trigger callback
      console.log("Consignment added successfully");
      // Optionally show success toast
    } catch (error) {
      console.error("Failed to submit consignment:", error);
      // Handle error display
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form state when the modal is closed externally
  useEffect(() => {
    if (!isOpen) {
      // Delay reset slightly to avoid flash of default values before closing animation
      const timer = setTimeout(() => {
        form.reset();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, form]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Consignment</DialogTitle>
          <DialogDescription>
            Enter the details for the new consignment item. Click save when
            done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          {/* Use form.handleSubmit here */}
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 px-1 py-4"
          >
            {/* Section 1: Consignment Details */}
            <h2 className="text-lg font-semibold border-b pb-2 mb-4">
              Consignment Details
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="client_ext_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Client <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value} // Use value here for controlled component
                        // Disable if initialClientId was provided? Or allow change? Currently allows change.
                      >
                        <FormControl>
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Select a client" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="consignment_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Consignment Date <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="date" {...field} className="h-9" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Brand <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter brand"
                          {...field}
                          className="h-9"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Model <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter model"
                          {...field}
                          className="h-9"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Code <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter code"
                          {...field}
                          className="h-9"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Color <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter color"
                          {...field}
                          className="h-9"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Size <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter size"
                          {...field}
                          className="h-9"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Condition <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="like-new">Like New</SelectItem>
                          <SelectItem value="excellent">Excellent</SelectItem>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="fair">Fair</SelectItem>
                          <SelectItem value="poor">Poor</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="selling_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Selling Price <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter selling price"
                          {...field}
                          className="h-9"
                          step="0.01" // Allow decimals
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="authentication_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Authentication Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Authenticated">
                            Authenticated
                          </SelectItem>
                          <SelectItem value="Not Authenticated">
                            Not Authenticated
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="item_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Item Status <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="A">Available</SelectItem>
                          <SelectItem value="S">Sold</SelectItem>
                          <SelectItem value="R">Returned</SelectItem>
                          <SelectItem value="X">Reject</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Conditionally render Reject Reason field */}
                {itemStatus === "X" && (
                  <FormField
                    control={form.control}
                    name="reject_reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Reject Reason <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter reject reason..."
                            className="h-9"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

            {/* Section 2: Inclusions & Images */}
            <h2 className="text-lg font-semibold border-b pb-2 mb-4 pt-6">
              Inclusions & Images
            </h2>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="inclusion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inclusions</FormLabel>
                    <FormControl>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Type inclusion and press Enter or + Add"
                            value={newInclusion}
                            onChange={(e) => setNewInclusion(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="h-9"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={handleAddInclusion}
                            className="h-9 w-9 flex-shrink-0"
                          >
                            <span className="sr-only">Add</span>
                            <span>+</span>
                          </Button>
                        </div>

                        <div className="flex flex-wrap gap-2 min-h-[24px]">
                          {" "}
                          {/* Ensure space even when empty */}
                          {field.value?.map((inclusion) => (
                            <Badge
                              key={inclusion}
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              {inclusion}
                              <button
                                type="button"
                                onClick={() => handleRemoveInclusion(inclusion)}
                                className="ml-1 opacity-50 hover:opacity-100"
                                aria-label={`Remove ${inclusion}`}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>

                        <div>
                          <h4 className="text-xs font-medium mb-2 text-muted-foreground">
                            Suggested
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {suggestedInclusions.map((inclusion) => (
                              <Button
                                key={inclusion}
                                type="button"
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1"
                                onClick={() =>
                                  handleAddSuggestedInclusion(inclusion)
                                }
                                disabled={field.value?.includes(inclusion)} // Disable if already added
                              >
                                <Tag className="h-3 w-3" />
                                {inclusion}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Images</FormLabel>
                    <FormControl>
                      <div className="space-y-3">
                        <div
                          className={cn(
                            "border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer h-48 transition-colors",
                            isDragging
                              ? "border-primary bg-primary/5"
                              : "border-muted-foreground/20 hover:border-muted-foreground/40"
                          )}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={openFileDialog}
                        >
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            multiple
                            accept="image/*" // Accept only image files
                          />
                          <Upload className="h-8 w-8 text-muted-foreground/50 mb-2" />
                          <p className="text-muted-foreground text-center text-sm">
                            Drag & drop images or click to browse
                          </p>
                        </div>

                        {field.value && field.value.length > 0 && (
                          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                            {field.value.map((image, index) => (
                              <div
                                key={index}
                                className="relative aspect-square rounded border border-muted-foreground/10 p-1 flex items-center justify-center bg-muted/20 overflow-hidden"
                              >
                                {/* Basic image preview could go here if URLs were available */}
                                <span className="text-xs truncate px-1 text-center">
                                  {image}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeImage(image)}
                                  className="absolute top-0.5 right-0.5 bg-background/70 backdrop-blur-sm rounded-full p-0.5 text-muted-foreground hover:text-foreground"
                                  aria-label={`Remove ${image}`}
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-6">
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
                  "Saving..."
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Save Consignment
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
