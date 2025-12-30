import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { formatDate } from "@/lib/format";
import type { ISubcategoryResponse } from "@/services/SubcategoryService";
import type { ISubsubcategoryResponse } from "@/services/SubsubcategoryService";
import { DeleteIcon, EditIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface ISubsubcategoryItemProps {
  subsubcategory: ISubsubcategoryResponse;
  subcategories: ISubcategoryResponse[];
  onOpenSubsubcategoryItemDialog: () => void;
  onDelete: () => void;
}

export function SubsubcategoryItem({
  subsubcategory,
  subcategories,
  onOpenSubsubcategoryItemDialog,
  onDelete,
}: ISubsubcategoryItemProps) {
  const subcategory = subcategories.find(
    (s) => s.id === subsubcategory.subCategoryId
  );

  return (
    <Item variant="outline">
      <ItemContent>
        <ItemTitle>{subsubcategory.name}</ItemTitle>
        <ItemDescription>
          <span className="text-muted-foreground text-xs">
            Subcategoria: {subcategory?.name || "N/A"} • Criado em{" "}
            {formatDate(new Date(subsubcategory.created_at))}
          </span>
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button
          variant="outline"
          size="icon"
          onClick={onOpenSubsubcategoryItemDialog}
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
