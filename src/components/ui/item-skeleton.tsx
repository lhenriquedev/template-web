import { Item, ItemActions, ItemContent } from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";

interface ItemSkeletonProps {
  count?: number;
  variant?: "default" | "outline" | "muted";
  size?: "default" | "sm" | "xs";
}

export function ItemSkeleton({
  count = 7,
  variant = "outline",
  size = "default",
}: ItemSkeletonProps) {
  return (
    <div className="rounded-md border">
      <div className="space-y-4 p-4">
        {Array.from({ length: count }).map((_, index) => (
          <Item key={index} variant={variant} size={size}>
            <ItemContent>
              <Skeleton className="h-5 w-[40%]" />
              <Skeleton className="h-4 w-[60%]" />
            </ItemContent>
            <ItemActions>
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </ItemActions>
          </Item>
        ))}
      </div>
    </div>
  );
}
