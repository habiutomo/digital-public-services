import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface ServiceCategoryFilterProps {
  categories: Array<{
    id: number;
    name: string;
    icon: string;
  }>;
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export function ServiceCategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory
}: ServiceCategoryFilterProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-6 overflow-x-auto">
      <div className="flex space-x-2 min-w-max">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          className={selectedCategory === null ? "bg-primary-600 text-white" : "bg-white text-gray-700"}
          onClick={() => onSelectCategory(null)}
        >
          {t("service.all_services")}
        </Button>
        
        {categories.map(category => (
          <Button
            key={category.id}
            variant={selectedCategory === category.name ? "default" : "outline"}
            className={selectedCategory === category.name
              ? "bg-primary-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
            }
            onClick={() => onSelectCategory(category.name)}
          >
            <span className="material-icons mr-1 text-sm">
              {category.icon}
            </span>
            <span>{category.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
