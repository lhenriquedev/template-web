import type * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { AppSidebarBrand } from "./AppSidebarBrand";
import { AppSidebarSection } from "./AppSidebarSection";
import { AppSidebarUser } from "./AppSidebarUser";
import {
  managementNavigation,
  primaryNavigation,
  secondaryNavigation,
} from "./navigation";

type AppSidebarNavProps = React.ComponentProps<typeof Sidebar>;

export function AppSidebarNav(props: AppSidebarNavProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AppSidebarBrand />
      </SidebarHeader>
      <SidebarContent>
        <AppSidebarSection items={primaryNavigation} />
        <AppSidebarSection
          items={managementNavigation}
          label="Management"
          className="group-data-[collapsible=icon]:hidden"
        />
        <AppSidebarSection items={secondaryNavigation} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <AppSidebarUser />
      </SidebarFooter>
    </Sidebar>
  );
}
