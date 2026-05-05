"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
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
  UpdateCategoryBody,
  UpdateCategoryBodyType,
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
  useGetCategoryDetailQuery,
  useGetCategoryTreeQuery,
  useUpdateCategoryMutation,
} from "@/queries/useCategory";
import { toast } from "sonner";

export default function EditCategory({
  id,
  setId,
  onSubmitSuccess,
}: {
  id?: number | undefined;
  setId: (value: number | undefined) => void;
  onSubmitSuccess?: () => void;
}) {
  const updateCategoryMutation = useUpdateCategoryMutation();
  const { data: categoryTreeData } = useGetCategoryTreeQuery();
  const { data: categoryData, isPending } = useGetCategoryDetailQuery({
    id: id as number,
    enabled: Boolean(id),
  });
  const form = useForm<UpdateCategoryBodyType>({
    resolver: zodResolver(UpdateCategoryBody),
    defaultValues: {
      name: "",
      parent_id: null,
      status: undefined,
      order: undefined,
    },
  });

  const categoryOptions = useMemo(() => {
    const options = flattenCategoryTree(categoryTreeData?.payload.data ?? []);
    return id ? options.filter((option) => option.id !== id) : options;
  }, [categoryTreeData, id]);

  useEffect(() => {
    const categoryDetail = categoryData?.payload?.data;
    if (!categoryDetail || Array.isArray(categoryDetail)) return;

    form.reset({
      name: categoryDetail.name ?? "",
      parent_id: categoryDetail.parent_id ?? null,
      status: categoryDetail.status ?? undefined,
      order: categoryDetail.order ?? undefined,
    });
  }, [categoryData, form]);

  const onSubmit = async (data: UpdateCategoryBodyType) => {
    if (isPending || updateCategoryMutation.isPending) return;
    try {
      const body: UpdateCategoryBodyType & { id: number } = {
        ...data,
        id: id as number,
      };
      const result = await updateCategoryMutation.mutateAsync(body);
      toast.success(result.payload.message);
      setId(undefined);
      form.reset();
      onSubmitSuccess?.();
    } catch (error: any) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    }
  };

  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) {
          setId(undefined);
          form.reset({
            name: "",
            parent_id: null,
            status: undefined,
            order: undefined,
          });
        }
      }}
    >
      <DialogContent className="sm:max-w-150 max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>Cap nhat danh muc</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="edit-category-form"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {form.watch("status") === undefined ? (
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : (
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
                            value={field.value}
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
            )}
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="edit-category-form">
            Luu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
