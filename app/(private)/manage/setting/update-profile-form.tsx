"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  UpdateMeBody,
  UpdateMeBodyType,
} from "@/schemaValidations/account.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useRef, useState } from "react";
import { useAccountMeQuery, useUpdateMeMutation } from "@/queries/useAccount";
import { useUploadAvatarMutation } from "@/queries/useMedia";
import { toast } from "sonner";

export default function UpdateProfileForm() {
  const [file, setFile] = useState<File | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const { data: accountProfile, refetch } = useAccountMeQuery();
  const updateMeMutation = useUpdateMeMutation();
  const uploadAvatarMutation = useUploadAvatarMutation();
  const form = useForm<UpdateMeBodyType>({
    resolver: zodResolver(UpdateMeBody),
    defaultValues: {
      name: "",
      avatar: "",
    },
  });
  const avatar = form.watch("avatar");
  const name = form.watch("name");

  useEffect(() => {
    if (accountProfile) {
      const { avatar, name } = accountProfile.payload.data;
      form.reset({
        avatar: avatar ?? "",
        name,
      });
    }
  }, [form, accountProfile]);

  const previewAvatar = () => {
    if (file) return URL.createObjectURL(file);
    return avatar;
  };
  const reset = () => {
    form.reset();
    setFile(null);
  };
  const onSubmit = async (data: UpdateMeBodyType) => {
    if (updateMeMutation.isPending || uploadAvatarMutation.isPending) return;
    try {
      let body = data;
      if (file) {
        const formData = new FormData();
        formData.append("image", file);

        const uploadResult = await uploadAvatarMutation.mutateAsync(formData);
        const imageUrl = uploadResult.payload.data;
        body = {
          ...body,
          avatar: imageUrl.avatar,
          avatarS3Key: imageUrl.avatarS3Key,
        };
      } else if (!file) {
        delete body.avatar;
      }
      const result = await updateMeMutation.mutateAsync(body);
      toast.success(result.payload.message);
      refetch();
    } catch (error) {}
  };
  return (
    <Form {...form}>
      <form
        noValidate
        className="grid auto-rows-max items-start gap-4 md:gap-8"
        onSubmit={form.handleSubmit(onSubmit)}
        onReset={reset}
      >
        <Card x-chunk="dashboard-07-chunk-0">
          <CardHeader>
            <CardTitle>Thông tin cá nhân</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-2 items-start justify-start">
                      <Avatar className="aspect-square w-25 h-25 rounded-md object-cover">
                        <AvatarImage src={previewAvatar()} />
                        <AvatarFallback className="rounded-none">
                          {name}
                        </AvatarFallback>
                      </Avatar>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={avatarInputRef}
                        onChange={(e) => {
                          const file = e.target?.files?.[0];
                          if (file) {
                            setFile(file)
                            field.onChange('http://fake-url.com/avatar.png') 
                          }
                        }}
                      />
                      <button
                        className="flex aspect-square w-25 items-center justify-center rounded-md border border-dashed"
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Upload</span>
                      </button>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-3">
                      <Label htmlFor="name">Tên</Label>
                      <Input
                        id="name"
                        type="text"
                        className="w-full"
                        {...field}
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <div className=" items-center gap-2 md:ml-auto flex">
                <Button variant="outline" size="sm" type="reset">
                  Hủy
                </Button>
                <Button size="sm" type="submit">
                  Lưu thông tin
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
