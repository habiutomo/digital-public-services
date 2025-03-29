import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { ServiceCard } from "@/components/services/service-card";
import { ServiceApplicationTable } from "@/components/services/service-application-table";
import { useApp } from "@/contexts/app-context";

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useApp();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch featured services
  const { 
    data: featuredServices = [],
    isLoading: isLoadingFeaturedServices
  } = useQuery({
    queryKey: ["/api/services/featured"],
    enabled: !!user
  });

  // Fetch applications
  const { 
    data: applicationsData = [],
    isLoading: isLoadingApplications
  } = useQuery({
    queryKey: ["/api/applications"],
    enabled: !!user
  });

  // Fetch services for application service names
  const { data: services = [] } = useQuery({
    queryKey: ["/api/services"],
    enabled: !!user
  });

  // Combine applications with service names
  const applications = applicationsData.map((application: any) => {
    const service = services.find((s: any) => s.id === application.serviceId);
    return {
      ...application,
      serviceName: service ? service.name : `Service #${application.serviceId}`
    };
  });

  // Get recent applications (last 3)
  const recentApplications = [...applications].sort((a, b) => 
    new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  ).slice(0, 3);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">{t("dashboard.welcome", { name: user?.fullName || "" })}</h2>
          <p className="text-gray-600 mt-1">{t("dashboard.subtitle")}</p>
        </div>
      </div>

      {/* Featured Services */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-3">{t("dashboard.featured_services")}</h3>
        {isLoadingFeaturedServices ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredServices.map((service: any) => (
              <ServiceCard
                key={service.id}
                id={service.id}
                name={service.name}
                description={service.description}
                category={service.category}
                icon={service.icon}
                featured={service.featured}
                popular={service.popular}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recent Applications */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-800 mb-3">{t("dashboard.recent_applications")}</h3>
        <ServiceApplicationTable
          applications={recentApplications}
          loading={isLoadingApplications}
        />
      </div>
    </div>
  );
}
