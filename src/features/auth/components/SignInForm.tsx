import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { FieldDescription, FieldGroup } from "@/components/ui/field";
import { appPaths } from "@/router/paths";

import { useSignInForm } from "../hooks/useSignInForm";
import { AuthFormField } from "./AuthFormField";

export function SignInForm() {
  const { form, onSubmit } = useSignInForm();

  return (
    <form onSubmit={onSubmit}>
      <FieldGroup>
        <AuthFormField
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          registration={form.register("email")}
          error={form.formState.errors.email}
        />
        <AuthFormField
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          registration={form.register("password")}
          error={form.formState.errors.password}
        />
        <Button size="lg" type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <HugeiconsIcon icon={Loading03Icon} className="animate-spin" />
          ) : (
            "Sign in"
          )}
        </Button>
        <FieldDescription className="text-center">
          Need an account? <Link to={appPaths.signUp}>Create one</Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
