import type { CSSProperties } from "react";
import { Outlet, useLocation } from "react-router";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { AppShellHeader } from "./AppShellHeader";
import { AppSidebarNav } from "./AppSidebarNav";
import { pageTitles } from "./navigation";

export function AppShell() {
  const location = useLocation();
  const pageTitle = pageTitles[location.pathname] ?? "Dashboard";

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 56)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as CSSProperties}
    >
      <AppSidebarNav variant="inset" />
      <SidebarInset>
        <AppShellHeader title={pageTitle} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2 p-4">
            <Outlet />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
