import { BankAccountList } from "@/features/bank-account/BankAccountList";
import { CreateBankAccountHeader } from "@/features/bank-account/CreateBankAccountHeader";

export default function BankAccountsPage() {
  return (
    <div className="flex flex-col gap-4">
      <CreateBankAccountHeader />
      <BankAccountList />
    </div>
  );
}
