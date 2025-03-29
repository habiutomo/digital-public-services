import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { ServiceCard } from "@/components/services/service-card";
import { ServiceCategoryFilter } from "@/components/services/service-category-filter";
import { ServiceDetailModal } from "@/components/services/service-detail-modal";
import { useApp } from "@/contexts/app-context";

export default function Services() {
  const { t } = useTranslation();
  const { user } = useApp();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Fetch all services
  const { 
    data: services = [],
    isLoading: isLoadingServices
  } = useQuery({
    queryKey: ["/api/services"],
    enabled: !!user
  });
  
  // Fetch service categories
  const { 
    data: categories = [],
    isLoading: isLoadingCategories
  } = useQuery({
    queryKey: ["/api/services/categories"],
    enabled: !!user
  });
  
  // Filter services based on search and category
  const filteredServices = services.filter((service: any) => {
    let matchesSearch = true;
    let matchesCategory = true;
    
    if (searchQuery) {
      matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    }
    
    if (selectedCategory) {
      matchesCategory = service.category === selectedCategory;
    }
    
    return matchesSearch && matchesCategory;
  });
  
  // Get featured services
  const featuredServices = filteredServices.filter((service: any) => service.featured);
  
  // Handle service card click
  const handleServiceClick = (service: any) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };
  
  // Handle category selection
  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
  };
  
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">{t("services.title")}</h2>
          <p className="text-gray-600 mt-1">{t("services.subtitle")}</p>
        </div>
      </div>
      
      {/* Category Filter */}
      {!isLoadingCategories && (
        <ServiceCategoryFilter 
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />
      )}
      
      {/* Featured Services */}
      {featuredServices.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-800 mb-3">{t("services.featured")}</h3>
          {isLoadingServices ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredServices.map((service: any) => (
                <div key={service.id} onClick={() => handleServiceClick(service)}>
                  <ServiceCard
                    id={service.id}
                    name={service.name}
                    description={service.description}
                    category={service.category}
                    icon={service.icon}
                    featured={service.featured}
                    popular={service.popular}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* All Services */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-3">{t("services.all")}</h3>
        {isLoadingServices ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredServices.map((service: any) => (
              <div 
                key={service.id}
                className="bg-white rounded-lg p-4 text-center cursor-pointer hover:shadow-sm transition-shadow"
                onClick={() => handleServiceClick(service)}
              >
                <div className={`w-12 h-12 mx-auto rounded-full ${
                  service.category === "Kependudukan" ? "bg-primary-100 text-primary-600" :
                  service.category === "Kesehatan" ? "bg-green-100 text-secondary-600" :
                  service.category === "Pendidikan" ? "bg-amber-100 text-amber-600" :
                  service.category === "Perizinan" ? "bg-amber-100 text-amber-600" :
                  "bg-gray-100 text-gray-600"
                } flex items-center justify-center`}>
                  <span className="material-icons">{service.icon}</span>
                </div>
                <h4 className="text-gray-800 font-medium mt-3 text-sm">{service.name}</h4>
              </div>
            ))}
            <div className="bg-white rounded-lg p-4 text-center cursor-pointer hover:shadow-sm transition-shadow bg-gray-50 border border-dashed border-gray-300">
              <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
                <span className="material-icons text-gray-400">more_horiz</span>
              </div>
              <h4 className="text-gray-500 font-medium mt-3 text-sm">{t("services.view_all")}</h4>
            </div>
          </div>
        )}
      </div>
      
      {/* Service Detail Modal */}
      <ServiceDetailModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={selectedService}
      />
    </div>
  );
}
