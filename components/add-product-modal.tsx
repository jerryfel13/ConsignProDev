"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { Save, Plus, Tag, X } from "lucide-react";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductCategoryModal } from "@/components/product-category-modal";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  category_ext_id: z.string().min(1, "Category is required"),
  brand_ext_id: z.string().min(1, "Brand is required"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  material: z.string().optional(),
  hardware: z.string().optional(),
  code: z.string().optional(),
  measurement: z.string().optional(),
  model: z.string().optional(),
  auth_ext_id: z.string().min(1, "Authenticator is required"),
  inclusion: z.array(z.string()),
  images: z.array(z.string()),
  condition_ext_id: z.string().min(1, "Condition is required"),
  cost: z.number().min(0, "Cost must be a positive number"),
  price: z.number().min(0, "Price must be a positive number"),
  is_consigned: z.boolean(),
  consignor_ext_id: z.string().optional(),
  consignor_selling_price: z.number().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void;
}

// Mock authenticator data - replace with API call
const authenticators = [
  { external_id: "auth1", name: "Bababebi" },
  { external_id: "auth2", name: "Zeko" },
];

const suggestedInclusions = [
  "Dust Bag",
  "Box",
  "Receipts",
  "Authentication Cards",
  "Warranty Card",
  "Straps",
  "Care Instructions",
];

export function AddProductModal({
  isOpen,
  onClose,
  onProductAdded,
}: AddProductModalProps) {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newInclusion, setNewInclusion] = useState("");
  const [inclusions, setInclusions] = useState<string[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category_ext_id: "",
      brand_ext_id: "",
      name: "",
      material: "",
      hardware: "",
      code: "",
      measurement: "",
      model: "",
      auth_ext_id: "",
      inclusion: [],
      images: [],
      condition_ext_id: "",
      cost: 0,
      price: 0,
      is_consigned: false,
      consignor_ext_id: "",
      consignor_selling_price: 0,
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      // TODO: Implement API call to create product
      console.log("Creating product:", data);
      onProductAdded();
      onClose();
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const handleCategoryAdded = (category: { external_id: string; name: string }) => {
    // TODO: Update categories list
    form.setValue("category_ext_id", category.external_id);
  };

  const handleAddInclusion = (value: string) => {
    if (value && !inclusions.includes(value)) {
      const newInclusions = [...inclusions, value];
      setInclusions(newInclusions);
      form.setValue("inclusion", newInclusions);
    }
    setNewInclusion("");
  };

  const handleRemoveInclusion = (value: string) => {
    const newInclusions = inclusions.filter(i => i !== value);
    setInclusions(newInclusions);
    form.setValue("inclusion", newInclusions);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddInclusion(newInclusion);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Enter the details for the new product.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category_ext_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category*</FormLabel>
                    <div className="flex gap-2">
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {/* TODO: Add categories from API */}
                          <SelectItem value="bags">Bags</SelectItem>
                          <SelectItem value="shoes">Shoes</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setIsCategoryModalOpen(true)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="brand_ext_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select brand" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* TODO: Add brands from API */}
                        <SelectItem value="gucci">Gucci</SelectItem>
                        <SelectItem value="lv">Louis Vuitton</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name*</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="material"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Material</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hardware"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hardware</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="measurement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Measurement</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="auth_ext_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Authenticator*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select authenticator" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {authenticators.map((auth) => (
                          <SelectItem key={auth.external_id} value={auth.external_id}>
                            {auth.name}
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
                name="condition_ext_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condition*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* TODO: Add conditions from API */}
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="like_new">Like New</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost*</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={e => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price*</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={e => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_consigned"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Consigned</FormLabel>
                      <FormDescription>
                        Is this a consigned item?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {form.watch("is_consigned") && (
                <>
                  <FormField
                    control={form.control}
                    name="consignor_ext_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Consignor</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select consignor" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {/* TODO: Add consignors from API */}
                            <SelectItem value="client1">Client 1</SelectItem>
                            <SelectItem value="client2">Client 2</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="consignor_selling_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Consignor Selling Price</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={e => field.onChange(e.target.valueAsNumber)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Inclusions</h2>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Inclusions</h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="Type inclusion and press Enter"
                    value={newInclusion}
                    onChange={(e) => setNewInclusion(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleAddInclusion(newInclusion)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Press Enter or click + to add each inclusion
                </p>

                {inclusions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {inclusions.map((inclusion) => (
                      <Badge
                        key={inclusion}
                        variant="secondary"
                        className="flex items-center gap-1"
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
                )}

                <div>
                  <h4 className="text-sm font-medium mb-2">Suggested</h4>
                  <div className="flex flex-wrap gap-2">
                    {suggestedInclusions.map((suggestion) => (
                      <Badge
                        key={suggestion}
                        variant="outline"
                        className="cursor-pointer hover:bg-secondary"
                        onClick={() => handleAddInclusion(suggestion)}
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="sticky bottom-0 bg-background pt-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
      <ProductCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onCategoryAdded={handleCategoryAdded}
      />
    </Dialog>
  );
}