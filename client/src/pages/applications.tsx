import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { ServiceApplicationTable } from "@/components/services/service-application-table";
import { useApp } from "@/contexts/app-context";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function Applications() {
  const { t } = useTranslation();
  const { user } = useApp();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
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
  
  // Filter applications based on search and status
  const filteredApplications = applications.filter((application: any) => {
    let matchesSearch = true;
    let matchesStatus = true;
    
    if (searchQuery) {
      matchesSearch = 
        application.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
        application.serviceName.toLowerCase().includes(searchQuery.toLowerCase());
    }
    
    if (statusFilter) {
      matchesStatus = application.status === statusFilter;
    }
    
    return matchesSearch && matchesStatus;
  });
  
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">{t("applications.title")}</h2>
          <p className="text-gray-600 mt-1">{t("applications.subtitle")}</p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white p-4 rounded-md shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="search" className="mb-2">{t("applications.search")}</Label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <span className="material-icons text-lg">search</span>
              </span>
              <Input
                type="text"
                id="search"
                placeholder={t("applications.search_placeholder")}
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="status" className="mb-2">{t("applications.filter_status")}</Label>
            <Select
              value={statusFilter || ""}
              onValueChange={(value) => setStatusFilter(value || null)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder={t("applications.all_statuses")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t("applications.all_statuses")}</SelectItem>
                <SelectItem value="pending">{t("application.status.pending")}</SelectItem>
                <SelectItem value="processing">{t("application.status.processing")}</SelectItem>
                <SelectItem value="completed">{t("application.status.completed")}</SelectItem>
                <SelectItem value="revision">{t("application.status.revision")}</SelectItem>
                <SelectItem value="rejected">{t("application.status.rejected")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {/* Applications Table */}
      <ServiceApplicationTable
        applications={filteredApplications}
        loading={isLoadingApplications}
      />
      
      {/* Application Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-primary-500">
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-3">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="material-icons text-primary-600">description</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t("applications.total_applications")}</p>
              <p className="text-xl font-semibold">{applications.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <span className="material-icons text-green-600">check_circle</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t("applications.completed")}</p>
              <p className="text-xl font-semibold">
                {applications.filter((app: any) => app.status === "completed").length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-amber-500">
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <span className="material-icons text-amber-600">pending</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t("applications.in_progress")}</p>
              <p className="text-xl font-semibold">
                {applications.filter((app: any) => app.status === "pending" || app.status === "processing").length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
