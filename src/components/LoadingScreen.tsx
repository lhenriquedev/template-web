import logo from "@/assets/logo-indaia.png";
import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function LoadingScreen() {
  return (
    <div className="bg-background flex min-h-screen w-full flex-col items-center justify-center">
      <div className="relative flex flex-col items-center justify-center">
        <img
          src={logo}
          alt="Indaiá Finance"
          className="h-24 w-auto animate-pulse object-contain md:h-32"
        />

        <HugeiconsIcon icon={Loading03Icon} className="animate-spin size-10" />
      </div>
    </div>
  );
}
