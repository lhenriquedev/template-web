import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ItemSkeleton } from "@/components/ui/item-skeleton";
import { useProfile } from "./useProfile";

export default function Profile() {
  const { profile, isProfileLoading } = useProfile(true);

  if (isProfileLoading) {
    return <ItemSkeleton count={3} variant="outline" />;
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Informações do Perfil</CardTitle>
          <CardDescription>Seus dados cadastrados no sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-1">
            <p className="text-muted-foreground text-sm">Nome Completo</p>
            <p className="font-medium">{profile.full_name}</p>
          </div>

          <div className="grid gap-1">
            <p className="text-muted-foreground text-sm">Email</p>
            <p className="font-medium">{profile.email}</p>
          </div>

          <div className="grid gap-1">
            <p className="text-muted-foreground text-sm">Função</p>
            <Badge variant="secondary" className="w-fit">
              {profile.role}
            </Badge>
          </div>

          <div className="grid gap-1">
            <p className="text-muted-foreground text-sm">ID do Usuário</p>
            <p className="text-muted-foreground font-mono text-xs">
              {profile.id}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
