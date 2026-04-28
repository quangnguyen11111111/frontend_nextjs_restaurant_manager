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
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  getTableLink,
  getVietnameseTableStatus,
  handleErrorApi,
} from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UpdateTableBody,
  UpdateTableBodyType,
} from "@/schemaValidations/table.schema";
import { TableStatus, TableStatusValues } from "@/constants/type";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import {
  useGetTableDetailQuery,
  useUpdateTableMutation,
} from "@/queries/useTable";
import { useEffect } from "react";
import QrCodeTable from "@/components/share/manage/tables/QrCodeTable";
import { TableCell, TableRow } from "@/components/ui/table";
import { columns } from "./table-table";
import { toast } from "sonner";

export default function EditTable({
  id,
  setId,
  onSubmitSuccess,
}: {
  id?: number | undefined;
  setId: (value: number | undefined) => void;
  onSubmitSuccess?: () => void;
}) {
  const form = useForm<UpdateTableBodyType>({
    resolver: zodResolver(UpdateTableBody),
    defaultValues: {
      capacity: 2,
      status: TableStatus.Hidden,
      changeToken: false,
    },
  });
  // xử lý cập nhật bàn ăn
  const upadteTableMutation = useUpdateTableMutation();
  const { data: tableData, isPending } = useGetTableDetailQuery({
    id: id as number,
    enabled: Boolean(id),
  });
  const tableNumber = tableData?.payload.data.number || 0;
  useEffect(() => {
    const table = tableData?.payload?.data;

    if (!table || Array.isArray(table)) return;

    form.reset({
      capacity: table.capacity,
      status: table.status,
      changeToken: false,
    });
  }, [tableData, form]);

  const onSubmit = async (data: UpdateTableBodyType) => {
    if (isPending || upadteTableMutation.isPending) return;
    try {
      let body: UpdateTableBodyType & { id: number } = {
        ...data,
        id: id as number,
      };
      await upadteTableMutation.mutateAsync(body);
      toast.success("Cập nhật bàn ăn thành công");
      setId(undefined);
      onSubmitSuccess?.();
      form.reset();
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
          form.reset();
        }
      }}
    >
      <DialogContent
        className="sm:max-w-150 max-h-screen overflow-auto"
        onCloseAutoFocus={() => {
          form.reset();
          setId(undefined);
        }}
      >
        <DialogHeader>
          <DialogTitle>Cập nhật bàn ăn</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="edit-table-form"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {isPending ? (
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid gap-4 py-4">
                <FormItem>
                  <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                    <Label htmlFor="name">Số hiệu bàn</Label>
                    <div className="col-span-3 w-full space-y-2">
                      <Input
                        id="number"
                        type="number"
                        className="w-full"
                        value={tableNumber}
                        readOnly
                      />
                      <FormMessage />
                    </div>
                  </div>
                </FormItem>
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                        <Label htmlFor="price">Sức chứa (người)</Label>
                        <div className="col-span-3 w-full space-y-2">
                         <Input
                          id="price"
                          type="number"
                          className="w-full"
                          value={field.value ?? 0}
                          onChange={(e) => {
                            const value = e.target.valueAsNumber;
                            field.onChange(isNaN(value) ? "" : value);
                          }}
                        />
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
                        <Label htmlFor="description">Trạng thái</Label>
                        <div className="col-span-3 w-full space-y-2">
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn trạng thái" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {TableStatusValues.map((status) => (
                                <SelectItem key={status} value={status}>
                                  {getVietnameseTableStatus(status)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="changeToken"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                        <Label htmlFor="price">Đổi QR Code</Label>
                        <div className="col-span-3 w-full space-y-2">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="changeToken"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </div>
                        </div>

                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                <FormItem>
                  <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                    <Label>QR Code</Label>
                    <div className="col-span-3 w-full space-y-2">
                      <QrCodeTable
                        token={tableData?.payload.data.token || ""}
                        tableNumber={tableNumber}
                        widthIn={180}
                        textSizeIn={14}
                      />
                    </div>
                  </div>
                </FormItem>
                <FormItem>
                  <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                    <Label>URL gọi món</Label>
                    <div className="col-span-3 w-full space-y-2">
                      <Link
                        href={getTableLink({
                          token: tableData?.payload.data.token || "123123123",
                          tableNumber: tableNumber,
                        })}
                        target="_blank"
                        className="break-all"
                      >
                        {getTableLink({
                          token: tableData?.payload.data.token || "123123123",
                          tableNumber: tableNumber,
                        })}
                      </Link>
                    </div>
                  </div>
                </FormItem>
              </div>
            )}
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="edit-table-form">
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
