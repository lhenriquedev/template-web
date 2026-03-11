import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { useAuth } from "@/contexts/useAuth";
import { appPaths } from "@/router/paths";

import { signInSchema, type SignInValues } from "../schemas/sign-in-schema";

export function useSignInForm() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await signIn(values.email, values.password);
      toast.success("You are now signed in.");
      navigate(appPaths.dashboard, { replace: true });
    } catch (error) {
      if (error instanceof AxiosError) {
        const message =
          typeof error.response?.data?.error === "string"
            ? error.response.data.error
            : "Unable to sign in with these credentials.";

        toast.error(message);
        return;
      }

      toast.error("Something went wrong while signing in.");
    }
  });

  return {
    form,
    onSubmit,
  };
}
