import {
  BuildingIcon,
  CreditCardIcon,
  LayersIcon,
  Settings01Icon,
  SidebarLeftIcon,
  TagIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";

import { appPaths } from "@/router/paths";

export type NavigationItem = {
  icon: IconSvgElement;
  label: string;
  path: string;
};

export const pageTitles: Record<string, string> = {
  [appPaths.dashboard]: "Dashboard",
  [appPaths.categories]: "Categories",
  [appPaths.companies]: "Companies",
  [appPaths.transactions]: "Transactions",
  [appPaths.profile]: "Profile",
  [appPaths.bankAccounts]: "Bank Accounts",
};

export const primaryNavigation: NavigationItem[] = [
  {
    icon: LayersIcon,
    label: "Dashboard",
    path: appPaths.dashboard,
  },
  {
    icon: SidebarLeftIcon,
    label: "Transactions",
    path: appPaths.transactions,
  },
];

export const managementNavigation: NavigationItem[] = [
  {
    icon: TagIcon,
    label: "Categories",
    path: appPaths.categories,
  },
  {
    icon: BuildingIcon,
    label: "Companies",
    path: appPaths.companies,
  },
  {
    icon: CreditCardIcon,
    label: "Bank Accounts",
    path: appPaths.bankAccounts,
  },
];

export const secondaryNavigation: NavigationItem[] = [
  {
    icon: Settings01Icon,
    label: "Profile",
    path: appPaths.profile,
  },
];
