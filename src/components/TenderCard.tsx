import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Building2, FileText } from "lucide-react";

interface TenderCardProps {
  title: string;
  organization: string;
  deadline: string;
  status: "draft" | "active" | "closed";
  budget: string;
}

const TenderCard = ({ title, organization, deadline, status, budget }: TenderCardProps) => {
  const statusColors = {
    draft: "bg-gray-100 text-gray-600 hover:bg-gray-200",
    active: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
    closed: "bg-red-50 text-red-600 hover:bg-red-100",
  };

  return (
    <Card className="group hover:bg-gray-50/50 transition-all duration-200 border border-gray-100">
      <CardHeader className="p-4">
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-base font-medium leading-none text-gray-900">{title}</CardTitle>
          <Badge className={`${statusColors[status]} font-normal`}>{status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-2.5">
          <div className="flex items-center text-sm text-gray-600">
            <Building2 className="h-3.5 w-3.5 mr-2 text-gray-400" />
            <span>{organization}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <CalendarDays className="h-3.5 w-3.5 mr-2 text-gray-400" />
            <span>Deadline: {deadline}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <FileText className="h-3.5 w-3.5 mr-2 text-gray-400" />
            <span>Budget: {budget}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TenderCard;