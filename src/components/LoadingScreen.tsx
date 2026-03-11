import { LayersIcon, Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function LoadingScreen() {
  return (
    <div className="bg-background flex min-h-screen w-full flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="bg-primary/10 text-primary flex size-20 items-center justify-center rounded-3xl border">
          <HugeiconsIcon icon={LayersIcon} strokeWidth={2} className="size-10" />
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-lg font-semibold">Template Web</p>
          <p className="text-muted-foreground text-sm">
            Loading the authenticated application shell.
          </p>
        </div>
        <HugeiconsIcon icon={Loading03Icon} className="size-8 animate-spin" />
      </div>
    </div>
  );
}
