"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, X, Tag, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type FormValues = {
  external_id: string;
  client_ext_id: string;
  consignment_date: string;
  brand: string;
  model: string;
  code: string;
  color: string;
  size: string;
  inclusion: string[];
  images: string[];
  condition: string;
  selling_price: string;
  authentication_status: string;
  item_status: string;
  is_rejected: boolean;
  reject_reason?: string;
  sold_to?: string;
  date_sold?: string;
  is_active: boolean;
  created_by: string;
};

const formSchema = z.object({
  external_id: z.string().min(1, {
    message: "External ID is required.",
  }),
  client_ext_id: z.string().min(1, {
    message: "Client ID is required.",
  }),
  consignment_date: z.string().min(1, {
    message: "Consignment date is required.",
  }),
  brand: z.string().optional(),
  model: z.string().optional(),
  code: z.string().optional(),
  color: z.string().optional(),
  size: z.string().optional(),
  inclusion: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  condition: z.string().min(1, {
    message: "Condition is required.",
  }),
  selling_price: z.string().min(1, {
    message: "Selling price is required.",
  }),
  authentication_status: z.string().min(1, {
    message: "Authentication status is required.",
  }),
  item_status: z.string().min(1, {
    message: "Item status is required.",
  }),
  is_rejected: z.boolean().default(false),
  reject_reason: z.string().optional(),
  sold_to: z.string().optional(),
  date_sold: z.string().optional(),
  is_active: z.boolean().default(true),
  created_by: z.string().min(1, {
    message: "Created by is required.",
  }),
});

// Sample client data - in a real app, this would come from your database
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

export default function NewConsignmentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newInclusion, setNewInclusion] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      external_id: "",
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
      item_status: "A",
      is_rejected: false,
      reject_reason: "",
      sold_to: "",
      date_sold: "",
      is_active: true,
      created_by: "admin", // This should come from your auth system
    },
  });

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileNames = Array.from(e.target.files).map((file) => file.name);
      const currentImages = form.getValues("images") || [];
      form.setValue("images", [...currentImages, ...fileNames]);
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
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    setIsSubmitting(true);

    // In a real application, you would send this data to your API
    console.log(values);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/consignments");
    }, 1000);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Add New Consignment</h1>
        <Button
          onClick={form.handleSubmit(onSubmit)}
          disabled={isSubmitting}
          variant="default"
          className="h-9 bg-black hover:bg-black/90"
        >
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="w-full bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="mb-6">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="pl-0 h-8 -ml-2"
                >
                  <Link href="/clients">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Link>
                </Button>
              </div>

              <h2 className="text-xl font-semibold mb-6">
                Consignment Details
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="external_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>External ID</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter external ID"
                            {...field}
                            className="h-10"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="client_ext_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-10">
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="consignment_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Consignment Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="h-10" />
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
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-10">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter brand"
                            {...field}
                            className="h-10"
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
                        <FormLabel>Model</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter model"
                            {...field}
                            className="h-10"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter code"
                            {...field}
                            className="h-10"
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
                        <FormLabel>Color</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter color"
                            {...field}
                            className="h-10"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Size</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter size"
                            {...field}
                            className="h-10"
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
                        <FormLabel>Condition</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-10">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="selling_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Selling Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter selling price"
                            {...field}
                            className="h-10"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="item_status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Item Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-10">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="A">Available</SelectItem>
                            <SelectItem value="S">Sold</SelectItem>
                            <SelectItem value="R">Returned</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full bg-white shadow-sm">
            <CardHeader>
              <CardTitle>Inclusions & Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="inclusion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inclusions</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Type inclusion and press Enter"
                            value={newInclusion}
                            onChange={(e) => setNewInclusion(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="h-10"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleAddInclusion}
                            className="h-10"
                          >
                            <span className="sr-only">Add</span>
                            <span>+</span>
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Press Enter or click + to add each inclusion
                        </p>

                        <div className="flex flex-wrap gap-2 mt-2">
                          {field.value?.map((inclusion) => (
                            <Badge
                              key={inclusion}
                              variant="secondary"
                              className="flex items-center gap-1 py-1 px-2"
                            >
                              {inclusion}
                              <button
                                type="button"
                                onClick={() => handleRemoveInclusion(inclusion)}
                                className="ml-1 hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>

                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">
                            Suggested
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {suggestedInclusions.map((inclusion) => (
                              <Button
                                key={inclusion}
                                type="button"
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1 h-9"
                                onClick={() =>
                                  handleAddSuggestedInclusion(inclusion)
                                }
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
                    <FormLabel>Upload Images</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <div
                          className={cn(
                            "border-2 border-dashed rounded-md p-8 flex flex-col items-center justify-center cursor-pointer h-64",
                            isDragging
                              ? "border-primary bg-primary/5"
                              : "border-muted-foreground/20"
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
                          />
                          <Upload className="h-10 w-10 text-muted-foreground/50 mb-4" />
                          <p className="text-muted-foreground text-center">
                            Drag and drop images here or click to select files
                          </p>
                        </div>

                        {field.value && field.value.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            {field.value.map((image, index) => (
                              <div
                                key={index}
                                className="relative rounded-md border border-muted-foreground/20 p-2 h-32 flex items-center justify-center bg-muted/20"
                              >
                                <button
                                  type="button"
                                  onClick={() => removeImage(image)}
                                  className="absolute top-1 right-1 bg-background rounded-full p-1 hover:bg-muted"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                                <span className="text-sm truncate max-w-full">
                                  {image}
                                </span>
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
            </CardContent>
          </Card>

          <Card className="w-full bg-white shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6">
                Additional Information
              </h2>

              <FormField
                control={form.control}
                name="reject_reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reject Reason</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter reject reason if applicable..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
