import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

interface Application {
  id: number;
  applicationNumber: string;
  serviceId: number;
  serviceName: string;
  status: string;
  submittedAt: string;
}

interface ServiceApplicationTableProps {
  applications: Application[];
  loading: boolean;
}

export function ServiceApplicationTable({ applications, loading }: ServiceApplicationTableProps) {
  const { t } = useTranslation();

  // Get status badge color and text
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            {t("application.status.pending")}
          </Badge>
        );
      case "processing":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            {t("application.status.processing")}
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            {t("application.status.completed")}
          </Badge>
        );
      case "revision":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            {t("application.status.revision")}
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
            {t("application.status.rejected")}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
            {status}
          </Badge>
        );
    }
  };

  // Format date to localized string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-lg py-8 px-4 text-center">
        <span className="material-icons text-gray-400 text-4xl mb-2">description</span>
        <h3 className="text-lg font-medium text-gray-900 mb-1">{t("application.no_applications_title")}</h3>
        <p className="text-gray-600">{t("application.no_applications_description")}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("application.table.number")}
              </TableHead>
              <TableHead className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("application.table.service")}
              </TableHead>
              <TableHead className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("application.table.date")}
              </TableHead>
              <TableHead className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("application.table.status")}
              </TableHead>
              <TableHead className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t("application.table.action")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map(application => (
              <TableRow key={application.id} className="border-b border-gray-200 hover:bg-gray-50">
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {application.applicationNumber}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {application.serviceName}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(application.submittedAt)}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(application.status)}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                  <Link href={`/applications/${application.id}`}>
                    <a className="text-primary-600 hover:text-primary-800">
                      {t("application.table.view_details")}
                    </a>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
