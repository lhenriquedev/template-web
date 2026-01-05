import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useListBankAccounts } from "@/features/bank-account/useListBankAccounts";
import { useListCategories } from "@/features/category/useListCategories";
import { useListCompanies } from "@/features/company/useListCompanies";
import { useListSubcategories } from "@/features/subcategory/useListSubcategories";
import { useListSubsubcategories } from "@/features/subsubcategory/useListSubsubcategories";
import { type IListTransactionsFilters } from "@/services/TransactionService";
import { Delete02Icon, FilterHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";

interface ITransactionFiltersProps {
  filters: IListTransactionsFilters;
  onFiltersChange: (filters: IListTransactionsFilters) => void;
}

export function TransactionFilters({
  filters,
  onFiltersChange,
}: ITransactionFiltersProps) {
  const { companies } = useListCompanies();
  const { bankAccounts } = useListBankAccounts();
  const { categories } = useListCategories();
  const { subcategories: allSubcategories } = useListSubcategories();
  const { subsubcategories: allSubsubcategories } = useListSubsubcategories();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    filters.category_id || ""
  );
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>(
    filters.subcategory_id || ""
  );

  const subcategories =
    allSubcategories?.filter((s) => s.category_id === selectedCategoryId) || [];
  const subsubcategories =
    allSubsubcategories?.filter(
      (s) => s.subcategory_id === selectedSubcategoryId
    ) || [];

  const handleClearFilters = () => {
    onFiltersChange({ page: 1, limit: 10 });
    setSelectedCategoryId("");
    setSelectedSubcategoryId("");
  };

  return (
    <div className="bg-muted/30 p-4 rounded-lg border space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HugeiconsIcon
            icon={FilterHorizontalIcon}
            strokeWidth={2}
            className="size-5"
          />
          <h3 className="font-semibold">Filtros</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={handleClearFilters}>
          <HugeiconsIcon
            icon={Delete02Icon}
            strokeWidth={2}
            className="size-4"
          />
          Limpar filtros
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Field>
          <FieldLabel>Empresa</FieldLabel>
          <Select
            value={filters.company_id || ""}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                company_id: value || undefined,
                page: 1,
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas</SelectItem>
              {companies?.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel>Conta Bancária</FieldLabel>
          <Select
            value={filters.bank_account_id || ""}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                bank_account_id: value || undefined,
                page: 1,
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas</SelectItem>
              {bankAccounts?.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name} - {account.bank_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel>Categoria</FieldLabel>
          <Select
            value={filters.category_id || ""}
            onValueChange={(value) => {
              setSelectedCategoryId(value || "");
              onFiltersChange({
                ...filters,
                category_id: value || undefined,
                subcategory_id: undefined,
                sub_subcategory_id: undefined,
                page: 1,
              });
              setSelectedSubcategoryId("");
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas</SelectItem>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {selectedCategoryId && (
          <Field>
            <FieldLabel>Subcategoria</FieldLabel>
            <Select
              value={filters.subcategory_id || ""}
              onValueChange={(value) => {
                setSelectedSubcategoryId(value || "");
                onFiltersChange({
                  ...filters,
                  subcategory_id: value || undefined,
                  sub_subcategory_id: undefined,
                  page: 1,
                });
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                {subcategories.map((subcategory) => (
                  <SelectItem key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        )}

        {selectedSubcategoryId && (
          <Field>
            <FieldLabel>Sub-subcategoria</FieldLabel>
            <Select
              value={filters.sub_subcategory_id || ""}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  sub_subcategory_id: value || undefined,
                  page: 1,
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                {subsubcategories.map((subsubcategory) => (
                  <SelectItem key={subsubcategory.id} value={subsubcategory.id}>
                    {subsubcategory.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        )}

        <Field>
          <FieldLabel>Competência (De)</FieldLabel>
          <Input
            type="date"
            value={filters.competence_date_start || ""}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                competence_date_start: e.target.value || undefined,
                page: 1,
              })
            }
          />
        </Field>

        <Field>
          <FieldLabel>Competência (Até)</FieldLabel>
          <Input
            type="date"
            value={filters.competence_date_end || ""}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                competence_date_end: e.target.value || undefined,
                page: 1,
              })
            }
          />
        </Field>

        <Field>
          <FieldLabel>Caixa (De)</FieldLabel>
          <Input
            type="date"
            value={filters.cash_date_start || ""}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                cash_date_start: e.target.value || undefined,
                page: 1,
              })
            }
          />
        </Field>

        <Field>
          <FieldLabel>Caixa (Até)</FieldLabel>
          <Input
            type="date"
            value={filters.cash_date_end || ""}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                cash_date_end: e.target.value || undefined,
                page: 1,
              })
            }
          />
        </Field>
      </div>
    </div>
  );
}
