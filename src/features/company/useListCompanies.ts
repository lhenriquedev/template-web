import { CompanyService } from "@/services/CompanyService";
import { useQuery } from "@tanstack/react-query";

export function useListCompanies() {
  const { data, isPending, error } = useQuery({
    queryKey: ["companies"],
    queryFn: () => CompanyService.listCompanies(),
    staleTime: 1000 * 60 * 5,
  });

  return { companies: data, isPending, error };
}
