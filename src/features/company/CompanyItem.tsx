import type { ICompanyResponse } from "@/services/CompanyService";

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

interface ICompanyItemProps {
  company: ICompanyResponse;
  onOpenCompanyItemDialog: () => void;
  onDelete: () => void;
}

export function CompanyItem({
  company,
  onOpenCompanyItemDialog,
  onDelete,
}: ICompanyItemProps) {
  return (
    <Item variant="outline">
      <ItemContent>
        <ItemTitle>{company.name}</ItemTitle>
        <ItemDescription>
          <span className="text-muted-foreground text-xs">
            {company.document} • Criado em{" "}
            {formatDate(new Date(company.created_at))}
          </span>
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button
          variant="outline"
          size="icon"
          onClick={onOpenCompanyItemDialog}
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
