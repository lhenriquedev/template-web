import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { useProfile } from "@/features/profile/hooks/useProfile";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function AppSidebarUser() {
  const { profile } = useProfile(true);

  const fullName = profile?.full_name ?? "Authenticated User";
  const email = profile?.email ?? "Profile unavailable";
  const role = profile?.role ?? "Member";
  const initials = getInitials(fullName);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{fullName}</span>
            <span className="text-muted-foreground truncate text-xs">{email}</span>
            <span className="text-muted-foreground truncate text-xs">{role}</span>
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
