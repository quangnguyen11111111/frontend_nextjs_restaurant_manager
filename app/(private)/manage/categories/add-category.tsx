"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  flattenCategoryTree,
  getVietnameseCategoryStatus,
  handleErrorApi,
} from "@/lib/utils";
import {
  CreateCategoryBody,
  CreateCategoryBodyType,
} from "@/schemaValidations/category.schema";
import { CategoryStatus, CategoryStatusValues } from "@/constants/type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAddCategoryMutation,
  useGetCategoryTreeQuery,
} from "@/queries/useCategory";
import { toast } from "sonner";

export default function AddCategory() {
  const [open, setOpen] = useState(false);
  const { data: categoryTreeData } = useGetCategoryTreeQuery();
  const addCategoryMutation = useAddCategoryMutation();
  const categoryOptions = useMemo(
    () => flattenCategoryTree(categoryTreeData?.payload.data ?? []),
    [categoryTreeData],
  );
  const form = useForm<CreateCategoryBodyType>({
    resolver: zodResolver(CreateCategoryBody),
    defaultValues: {
      name: "",
      parent_id: null,
      status: CategoryStatus.Active,
      order: undefined,
    },
  });

  const reset = () => {
    form.reset();
    setOpen(false);
  };

  const onSubmit = async (data: CreateCategoryBodyType) => {
    if (addCategoryMutation.isPending) return;
    try {
      const result = await addCategoryMutation.mutateAsync(data);
      toast.success(result.payload.message);
      reset();
    } catch (error: any) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    }
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Them danh muc
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-150 max-h-screen overflow-auto"
        onCloseAutoFocus={() => form.reset()}
      >
        <DialogHeader>
          <DialogTitle>Them danh muc</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="add-category-form"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="name">Ten danh muc</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input id="name" className="w-full" {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="parent_id"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="parent_id">Danh muc cha</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Select
                          value={field.value ? String(field.value) : "none"}
                          onValueChange={(value) =>
                            field.onChange(
                              value === "none" ? null : Number(value),
                            )
                          }
                        >
                          <FormControl>
                            <SelectTrigger id="parent_id">
                              <SelectValue placeholder="Chon danh muc" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">Khong co</SelectItem>
                            {categoryOptions.map((option) => (
                              <SelectItem
                                key={option.id}
                                value={String(option.id)}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="status">Trang thai</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger id="status">
                              <SelectValue placeholder="Chon trang thai" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CategoryStatusValues.map((status) => (
                              <SelectItem key={status} value={status}>
                                {getVietnameseCategoryStatus(status)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="order">Thu tu</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input
                          id="order"
                          type="number"
                          className="w-full"
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const rawValue = e.target.value;
                            if (rawValue === "") {
                              field.onChange(undefined);
                              return;
                            }
                            const value = e.target.valueAsNumber;
                            field.onChange(isNaN(value) ? undefined : value);
                          }}
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="add-category-form">
            Them
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
