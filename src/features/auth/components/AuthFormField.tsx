import type { FieldError as ReactHookFormFieldError, UseFormRegisterReturn } from "react-hook-form";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type AuthFormFieldProps = {
  autoComplete?: string;
  error?: ReactHookFormFieldError;
  label: string;
  placeholder?: string;
  registration: UseFormRegisterReturn;
  type?: string;
};

export function AuthFormField({
  autoComplete,
  error,
  label,
  placeholder,
  registration,
  type = "text",
}: AuthFormFieldProps) {
  const inputId = registration.name;

  return (
    <Field>
      <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
      <Input
        id={inputId}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        {...registration}
      />
      <FieldError errors={[error]} />
    </Field>
  );
}
