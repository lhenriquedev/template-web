import {
  SubsubcategoryService,
  type ISubsubcategoryResponse,
  type IUpdateSubsubcategoryDTO,
} from "@/services/SubsubcategoryService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateSubsubcategory() {
  const queryClient = useQueryClient();

  const { mutateAsync: updateSubsubcategory, isPending } = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: IUpdateSubsubcategoryDTO;
    }) => SubsubcategoryService.updateSubsubcategory(id, data),
    onMutate: async ({ id, data }, context) => {
      await queryClient.cancelQueries({ queryKey: ["subsubcategories"] });

      const previousSubsubcategories =
        context.client.getQueryData<ISubsubcategoryResponse[]>([
          "subsubcategories",
        ]);

      context.client.setQueryData(
        ["subsubcategories"],
        (old: ISubsubcategoryResponse[] = []) =>
          old.map((subsubcategory) =>
            subsubcategory.id === id ? { ...subsubcategory, ...data } : subsubcategory
          )
      );

      return { previousSubsubcategories };
    },
    onError: (_error, _variables, onMutateResult, context) => {
      context.client.setQueryData(
        ["subsubcategories"],
        onMutateResult?.previousSubsubcategories
      );
    },
    onSettled: (data, error, variables, onMutateResult, context) => {
      context.client.invalidateQueries({ queryKey: ["subsubcategories"] });
    },
  });

  return { updateSubsubcategory, isPending };
}
