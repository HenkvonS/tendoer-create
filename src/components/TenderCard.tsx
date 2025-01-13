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
    draft: "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
    active: "bg-success text-white",
    closed: "bg-destructive text-destructive-foreground",
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <Badge className={statusColors[status]}>{status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center text-muted-foreground">
            <Building2 className="h-4 w-4 mr-2" />
            <span>{organization}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <CalendarDays className="h-4 w-4 mr-2" />
            <span>Deadline: {deadline}</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <FileText className="h-4 w-4 mr-2" />
            <span>Budget: {budget}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TenderCard;