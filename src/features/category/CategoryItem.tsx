import type { ICategoryResponse } from "@/services/CategoryService";

import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { formatDate } from "@/lib/format";
import { DeleteIcon, EditIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface ICategoryItemProps {
  category: ICategoryResponse;
  onOpenCategoryItemDialog: () => void;
  onDelete: () => void;
}

export function CategoryItem({
  category,
  onOpenCategoryItemDialog,
  onDelete,
}: ICategoryItemProps) {
  return (
    <Item variant="outline">
      <ItemContent>
        <ItemTitle>{category.name}</ItemTitle>
        <ItemDescription>
          <span className="text-muted-foreground text-xs">
            Criado em {formatDate(new Date(category.created_at))}
          </span>
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button
          variant="outline"
          size="icon"
          onClick={onOpenCategoryItemDialog}
        >
          <HugeiconsIcon icon={EditIcon} strokeWidth={2} />
        </Button>
        <Button variant="destructive" size="icon" onClick={onDelete}>
          <HugeiconsIcon icon={DeleteIcon} strokeWidth={2} />
        </Button>
      </ItemActions>
    </Item>
  );
}
