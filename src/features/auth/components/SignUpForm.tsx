import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { FieldDescription, FieldGroup } from "@/components/ui/field";
import { appPaths } from "@/router/paths";

import { useSignUpForm } from "../hooks/useSignUpForm";
import { AuthFormField } from "./AuthFormField";

export function SignUpForm() {
  const { form, onSubmit } = useSignUpForm();

  return (
    <form onSubmit={onSubmit}>
      <FieldGroup>
        <AuthFormField
          label="Full name"
          autoComplete="name"
          placeholder="Jane Doe"
          registration={form.register("full_name")}
          error={form.formState.errors.full_name}
        />
        <AuthFormField
          label="Role"
          autoComplete="organization-title"
          placeholder="Member"
          registration={form.register("role")}
          error={form.formState.errors.role}
        />
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
          autoComplete="new-password"
          placeholder="Create a password"
          registration={form.register("password")}
          error={form.formState.errors.password}
        />
        <AuthFormField
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          placeholder="Repeat the password"
          registration={form.register("confirmPassword")}
          error={form.formState.errors.confirmPassword}
        />
        <Button size="lg" type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <HugeiconsIcon icon={Loading03Icon} className="animate-spin" />
          ) : (
            "Create account"
          )}
        </Button>
        <FieldDescription className="text-center">
          Already have an account? <Link to={appPaths.signIn}>Sign in</Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
