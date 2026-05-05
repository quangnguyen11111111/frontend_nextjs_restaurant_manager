import categoryApiRequest from "@/apiRequest/category";
import { UpdateCategoryBodyType } from "@/schemaValidations/category.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetCategoryListQuery = (page: number) => {
  return useQuery({
    queryKey: ["category-list", page],
    queryFn: () => categoryApiRequest.listAdmin(page),
  });
};

export const useGetCategoryTreeQuery = () => {
  return useQuery({
    queryKey: ["category-tree"],
    queryFn: () => categoryApiRequest.listTree(),
  });
};

export const useGetCategoryDetailQuery = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["category-detail", id],
    queryFn: () => categoryApiRequest.getDetail(id),
    enabled,
  });
};

export const useAddCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: categoryApiRequest.add,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-list"] });
      queryClient.invalidateQueries({ queryKey: ["category-tree"] });
    },
  });
};

export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateCategoryBodyType & { id: number }) =>
      categoryApiRequest.update(id, body),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["category-list"] });
      queryClient.invalidateQueries({ queryKey: ["category-tree"] });
      queryClient.invalidateQueries({
        queryKey: ["category-detail", variables.id],
      });
    },
  });
};

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => categoryApiRequest.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["category-list"] });
      queryClient.invalidateQueries({ queryKey: ["category-tree"] });
    },
  });
};
