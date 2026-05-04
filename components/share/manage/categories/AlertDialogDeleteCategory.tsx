"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CategoryListResType } from "@/schemaValidations/category.schema";
import { useDeleteCategoryMutation } from "@/queries/useCategory";
import { toast } from "sonner";
import { handleErrorApi } from "@/lib/utils";

type CategoryItem = CategoryListResType["data"][0];

export function AlertDialogDeleteCategory({
  categoryDelete,
  setCategoryDelete,
}: {
  categoryDelete: CategoryItem | null;
  setCategoryDelete: (value: CategoryItem | null) => void;
}) {
  const deleteCategory = useDeleteCategoryMutation();
  const handleDelete = async () => {
    if (categoryDelete) {
      try {
        const result = await deleteCategory.mutateAsync(categoryDelete.id);
        setCategoryDelete(null);
        toast.success(result.payload.message);
      } catch (error: any) {
        handleErrorApi({ error });
      }
    }
  };

  return (
    <AlertDialog
      open={Boolean(categoryDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setCategoryDelete(null);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xoa danh muc?</AlertDialogTitle>
          <AlertDialogDescription>
            Danh muc{" "}
            <span className="bg-foreground text-primary-foreground rounded px-1">
              {categoryDelete?.name}
            </span>{" "}
            se bi xoa vinh vien
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
