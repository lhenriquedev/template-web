import {
  SubcategoryService,
  type ISubcategoryResponse,
  type IUpdateSubcategoryDTO,
} from "@/services/SubcategoryService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateSubcategory() {
  const queryClient = useQueryClient();

  const { mutateAsync: updateSubcategory, isPending } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdateSubcategoryDTO }) =>
      SubcategoryService.updateSubcategory(id, data),
    onMutate: async ({ id, data }, context) => {
      await queryClient.cancelQueries({ queryKey: ["subcategories"] });

      const previousSubcategories =
        context.client.getQueryData<ISubcategoryResponse[]>(["subcategories"]);

      context.client.setQueryData(
        ["subcategories"],
        (old: ISubcategoryResponse[] = []) =>
          old.map((subcategory) =>
            subcategory.id === id ? { ...subcategory, ...data } : subcategory
          )
      );

      return { previousSubcategories };
    },
    onError: (_error, _variables, onMutateResult, context) => {
      context.client.setQueryData(
        ["subcategories"],
        onMutateResult?.previousSubcategories
      );
    },
    onSettled: (data, error, variables, onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: ["subcategories"] });
    },
  });

  return { updateSubcategory, isPending };
}
