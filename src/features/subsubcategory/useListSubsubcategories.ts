import { SubsubcategoryService } from "@/services/SubsubcategoryService";
import { useQuery } from "@tanstack/react-query";

export function useListSubsubcategories() {
  const { data, isPending, error } = useQuery({
    queryKey: ["subsubcategories"],
    queryFn: () => SubsubcategoryService.listSubsubcategories(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return { subsubcategories: data, isPending, error };
}
