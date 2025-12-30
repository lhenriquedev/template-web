import type { VariantProps } from "class-variance-authority";
import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button, buttonVariants } from "@/components/ui/button";
import type { ReactNode } from "react";

interface LoadingButtonProps extends VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  loadingText?: string;
  children?: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export function LoadingButton({
  isLoading = false,
  loadingText,
  children,
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <Button disabled={disabled || isLoading} {...props}>
      {isLoading && (
        <HugeiconsIcon
          icon={Loading03Icon}
          strokeWidth={2}
          className="animate-spin"
        />
      )}
      {isLoading && loadingText ? loadingText : children}
    </Button>
  );
}
