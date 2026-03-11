import { LayersIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { NavLink } from "react-router";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { appPaths } from "@/router/paths";

export function AppSidebarBrand() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <NavLink to={appPaths.dashboard}>
          <SidebarMenuButton className="data-[slot=sidebar-menu-button]:!p-1.5">
            <HugeiconsIcon icon={LayersIcon} strokeWidth={2} className="!size-5" />
            <span className="text-base font-semibold">Template Web</span>
          </SidebarMenuButton>
        </NavLink>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
