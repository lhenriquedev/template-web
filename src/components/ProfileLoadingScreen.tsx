import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function ProfileLoadingScreen() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <HugeiconsIcon
          icon={Loading03Icon}
          strokeWidth={2}
          className="size-12 animate-spin text-primary"
        />
        <p className="text-muted-foreground text-sm">
          Carregando perfil...
        </p>
      </div>
    </div>
  );
}
