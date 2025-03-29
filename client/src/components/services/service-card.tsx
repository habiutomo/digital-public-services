import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

interface ServiceCardProps {
  id: number;
  name: string;
  description: string;
  category: string;
  icon: string;
  featured: boolean;
  popular: boolean;
}

export function ServiceCard({
  id,
  name,
  description,
  category,
  icon,
  featured,
  popular
}: ServiceCardProps) {
  const { t } = useTranslation();
  
  // Determine the color for the icon based on category
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Kependudukan":
        return "bg-primary-100 text-primary-600";
      case "Kesehatan":
        return "bg-green-100 text-secondary-600";
      case "Pendidikan":
        return "bg-amber-100 text-amber-600";
      case "Perizinan":
        return "bg-amber-100 text-amber-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const iconColor = getCategoryColor(category);

  return (
    <Card className="bg-white rounded-lg shadow-sm p-5 cursor-pointer hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="flex justify-between items-start">
          <div className={`w-12 h-12 rounded-full ${iconColor} flex items-center justify-center`}>
            <span className="material-icons">{icon}</span>
          </div>
          {popular && (
            <Badge className="bg-info bg-opacity-10 text-info">
              {t("service.popular")}
            </Badge>
          )}
        </div>
        <h4 className="text-gray-800 font-medium mt-4">{name}</h4>
        <p className="text-gray-600 text-sm mt-1">{description}</p>
        <Link href={`/services/${id}`}>
          <a className="mt-4 flex items-center text-primary-600">
            <span className="text-sm font-medium">{t("service.apply_now")}</span>
            <span className="material-icons ml-1 text-sm">arrow_forward</span>
          </a>
        </Link>
      </CardContent>
    </Card>
  );
}
