import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type FeaturePageProps = {
  description: string;
  title: string;
};

export function FeaturePage({ description, title }: FeaturePageProps) {
  return (
    <section className="flex flex-1 flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground rounded-lg border border-dashed p-6 text-sm">
            This screen is intentionally minimal so the template stays coherent
            while each feature evolves behind a stable route and layout.
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
