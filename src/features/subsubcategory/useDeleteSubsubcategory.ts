import {
  SubsubcategoryService,
  type ISubsubcategoryResponse,
} from "@/services/SubsubcategoryService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteSubsubcategory() {
  const queryClient = useQueryClient();

  const { mutateAsync: deleteSubsubcategory, isPending } = useMutation({
    mutationFn: (id: string) => SubsubcategoryService.deleteSubsubcategory(id),
    onMutate: async (id, context) => {
      await queryClient.cancelQueries({ queryKey: ["subsubcategories"] });

      const previousSubsubcategories =
        context.client.getQueryData<ISubsubcategoryResponse[]>([
          "subsubcategories",
        ]);

      context.client.setQueryData(
        ["subsubcategories"],
        (old: ISubsubcategoryResponse[] = []) =>
          old.filter((subsubcategory) => subsubcategory.id !== id)
      );

      return { previousSubsubcategories };
    },
    onError: (_error, _id, onMutateResult, context) => {
      context.client.setQueryData(
        ["subsubcategories"],
        onMutateResult?.previousSubsubcategories
      );
    },
    onSettled: (data, error, variables, onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: ["subsubcategories"] });
    },
  });

  return { deleteSubsubcategory, isPending };
}
