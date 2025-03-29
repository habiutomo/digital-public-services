import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ServiceDetailModal } from "@/components/services/service-detail-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useApp } from "@/contexts/app-context";

interface ServiceDetailProps {
  id: string;
}

export default function ServiceDetail({ id }: ServiceDetailProps) {
  const { t } = useTranslation();
  const { user } = useApp();
  const [location, setLocation] = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const serviceId = parseInt(id);
  
  // Fetch service details
  const { 
    data: service,
    isLoading,
    error
  } = useQuery({
    queryKey: [`/api/services/${id}`],
    enabled: !!user && !isNaN(serviceId)
  });
  
  // Redirect to services page if invalid ID or error
  useEffect(() => {
    if ((!isLoading && !service) || error || isNaN(serviceId)) {
      setLocation("/services");
    }
  }, [service, isLoading, error, serviceId, setLocation]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (!service) return null;
  
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
  
  const iconColor = getCategoryColor(service.category);
  
  return (
    <div>
      <div className="mb-6">
        <Button
          variant="outline"
          className="mb-4"
          onClick={() => setLocation("/services")}
        >
          <span className="material-icons mr-1 text-sm">arrow_back</span>
          {t("common.back")}
        </Button>
        
        <h2 className="text-2xl font-semibold text-gray-800">{service.name}</h2>
        <p className="text-gray-600 mt-1">
          <span className="inline-flex items-center bg-gray-100 text-gray-800 rounded-full px-3 py-1 text-sm">
            <span className="material-icons text-sm mr-1">{service.icon}</span>
            {service.category}
          </span>
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("service_detail.about")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{service.description}</p>
              
              <div className="mt-6">
                <h3 className="font-medium text-gray-900 mb-2">{t("service_detail.requirements")}</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>{t("service_detail.requirement_id")}</li>
                  <li>{t("service_detail.requirement_photo")}</li>
                  <li>{t("service_detail.requirement_address")}</li>
                  <li>{t("service_detail.requirement_fee")}</li>
                </ul>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium text-gray-900 mb-2">{t("service_detail.process")}</h3>
                <ol className="list-decimal list-inside text-gray-700 space-y-3">
                  <li className="flex items-start">
                    <span className="mr-2">1.</span>
                    <span>{t("service_detail.process_1")}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">2.</span>
                    <span>{t("service_detail.process_2")}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">3.</span>
                    <span>{t("service_detail.process_3")}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">4.</span>
                    <span>{t("service_detail.process_4")}</span>
                  </li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>{t("service_detail.apply")}</CardTitle>
              <CardDescription>{t("service_detail.apply_description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`w-16 h-16 rounded-full ${iconColor} flex items-center justify-center mb-4`}>
                <span className="material-icons text-2xl">{service.icon}</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">{t("service_detail.processing_time")}</p>
                  <p className="font-medium">3-5 {t("common.days")}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">{t("service_detail.fee")}</p>
                  <p className="font-medium">Rp 0</p>
                </div>
                
                <Button 
                  className="w-full"
                  onClick={() => setIsModalOpen(true)}
                >
                  {t("service_detail.apply_button")}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>{t("service_detail.help")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="material-icons text-primary-600 mr-2">phone</span>
                  <span>Call Center: 1500123</span>
                </div>
                <div className="flex items-center">
                  <span className="material-icons text-primary-600 mr-2">email</span>
                  <span>layanan@gov.id</span>
                </div>
                <div className="flex items-center">
                  <span className="material-icons text-primary-600 mr-2">support_agent</span>
                  <span>{t("service_detail.live_chat")}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Service Application Modal */}
      <ServiceDetailModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={service}
      />
    </div>
  );
}
