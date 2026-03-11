import { HugeiconsIcon } from "@hugeicons/react";
import { NavLink } from "react-router";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

import type { NavigationItem } from "./navigation";

type AppSidebarSectionProps = {
  items: NavigationItem[];
  label?: string;
  className?: string;
};

export function AppSidebarSection({
  items,
  label,
  className,
}: AppSidebarSectionProps) {
  return (
    <SidebarGroup className={cn(className, !label && "gap-0")}>
      {label ? <SidebarGroupLabel>{label}</SidebarGroupLabel> : null}
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.path}>
              <NavLink to={item.path}>
                <SidebarMenuButton tooltip={item.label}>
                  <HugeiconsIcon icon={item.icon} strokeWidth={2} />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </NavLink>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
