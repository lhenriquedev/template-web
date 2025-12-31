import { CompanyList } from "@/features/company/CompanyList";
import { CreateCompanyHeader } from "@/features/company/CreateCompanyHeader";

export default function CompaniesPage() {
  return (
    <div className="flex flex-col gap-4">
      <CreateCompanyHeader />
      <CompanyList />
    </div>
  );
}
