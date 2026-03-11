import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { appPaths } from "@/router/paths";
import { AuthService } from "@/services/AuthService";

import { signUpSchema, type SignUpValues } from "../schemas/sign-up-schema";

export function useSignUpForm() {
  const navigate = useNavigate();
  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      full_name: "",
      role: "Member",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await AuthService.signUp({
        full_name: values.full_name,
        role: values.role,
        email: values.email,
        password: values.password,
      });

      toast.success("Account created. You can now sign in.");
      navigate(appPaths.signIn, { replace: true });
    } catch (error) {
      if (error instanceof AxiosError) {
        const message =
          typeof error.response?.data?.error === "string"
            ? error.response.data.error
            : "Unable to create the account right now.";

        toast.error(message);
        return;
      }

      toast.error("Something went wrong while creating the account.");
    }
  });

  return {
    form,
    onSubmit,
  };
}
