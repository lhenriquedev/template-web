import { useQuery } from "@tanstack/react-query";

import { AuthService } from "@/services/AuthService";

export function useProfile(enabled = true) {
  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: AuthService.getProfile,
    enabled,
    retry: false,
  });

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
  };
}
