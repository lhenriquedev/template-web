import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { formatCurrency, formatDate } from "@/lib/format";
import type { IBankAccountResponse } from "@/services/BankAccountService";
import { DeleteIcon, EditIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface IBankAccountItemProps {
  bankAccount: IBankAccountResponse;
  companyName?: string;
  onOpenBankAccountItemDialog: () => void;
  onDelete: () => void;
}

export function BankAccountItem({
  bankAccount,
  companyName,
  onOpenBankAccountItemDialog,
  onDelete,
}: IBankAccountItemProps) {
  return (
    <Item variant="outline">
      <ItemContent>
        <ItemTitle>{bankAccount.name}</ItemTitle>
        <ItemDescription>
          <span className="text-muted-foreground text-xs">
            {bankAccount.bank_name}
            {bankAccount.account_number && ` • Conta: ${bankAccount.account_number}`}
            {companyName && ` • ${companyName}`}
          </span>
        </ItemDescription>
        <ItemDescription>
          <span className="text-muted-foreground text-xs">
            Saldo: {formatCurrency(bankAccount.current_balance)} • Criado em{" "}
            {formatDate(new Date(bankAccount.created_at))}
          </span>
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button
          variant="outline"
          size="icon"
          onClick={onOpenBankAccountItemDialog}
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
