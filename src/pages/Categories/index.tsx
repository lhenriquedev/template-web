import { ItemSkeleton } from "@/components/ui/item-skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryList } from "@/features/category/CategoryList";
import { CreateCategoryHeader } from "@/features/category/CreateCategoryHeader";
import { CreateSubcategoryHeader } from "@/features/subcategory/CreateSubcategoryHeader";
import { SubcategoryList } from "@/features/subcategory/SubcategoryList";
import { CreateSubsubcategoryHeader } from "@/features/subsubcategory/CreateSubsubcategoryHeader";
import { SubsubcategoryList } from "@/features/subsubcategory/SubsubcategoryList";
import { Suspense, useState } from "react";

export default function CategoriesPage() {
  const [activeTab, setActiveTab] = useState<
    "categories" | "subcategories" | "subsubcategories"
  >("categories");
  return (
    <div className="flex flex-col gap-6">
      {activeTab === "categories" && <CreateCategoryHeader />}
      {activeTab === "subcategories" && <CreateSubcategoryHeader />}
      {activeTab === "subsubcategories" && <CreateSubsubcategoryHeader />}

      <Tabs
        defaultValue={activeTab}
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsList>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="subcategories">Subcategorias</TabsTrigger>
          <TabsTrigger value="subsubcategories">Sub-subcategorias</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4 mt-8">
          <Suspense fallback={<ItemSkeleton count={7} variant="outline" />}>
            <CategoryList />
          </Suspense>
        </TabsContent>

        <TabsContent value="subcategories" className="space-y-4 mt-8">
          <Suspense fallback={<ItemSkeleton count={7} variant="outline" />}>
            <SubcategoryList />
          </Suspense>
        </TabsContent>

        <TabsContent value="subsubcategories" className="space-y-4 mt-8">
          <Suspense fallback={<ItemSkeleton count={7} variant="outline" />}>
            <SubsubcategoryList />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
