import { Button } from "@/components/ui/button";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { useListCategories } from "../category/useListCategories";
import { CreateSubcategoryForm } from "./CreateSubcategoryForm";

export function CreateSubcategoryHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const { categories } = useListCategories();

  return (
    <>
      <div className="flex gap-4 justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Gestão de Subcategorias
          </h1>
          <p className="text-muted-foreground text-sm">
            Organize suas subcategorias vinculadas a categorias.
          </p>
        </div>

        <Button size="lg" variant="default" onClick={() => setIsOpen(true)}>
          <HugeiconsIcon icon={PlusSignIcon} strokeWidth={2} />
          Nova subcategoria
        </Button>
      </div>

      <CreateSubcategoryForm
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        categories={categories || []}
      />
    </>
  );
}
