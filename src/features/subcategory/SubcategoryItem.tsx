import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { formatDate } from "@/lib/format";
import type { ICategoryResponse } from "@/services/CategoryService";
import type { ISubcategoryResponse } from "@/services/SubcategoryService";
import { DeleteIcon, EditIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface ISubcategoryItemProps {
  subcategory: ISubcategoryResponse;
  categories: ICategoryResponse[];
  onOpenSubcategoryItemDialog: () => void;
  onDelete: () => void;
}

export function SubcategoryItem({
  subcategory,
  categories,
  onOpenSubcategoryItemDialog,
  onDelete,
}: ISubcategoryItemProps) {
  const category = categories.find((c) => c.id === subcategory.categoryId);

  return (
    <Item variant="outline">
      <ItemContent>
        <ItemTitle>{subcategory.name}</ItemTitle>
        <ItemDescription>
          <span className="text-muted-foreground text-xs">
            Categoria: {category?.name || "N/A"} • Criado em{" "}
            {formatDate(new Date(subcategory.created_at))}
          </span>
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button
          variant="outline"
          size="icon"
          onClick={onOpenSubcategoryItemDialog}
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
