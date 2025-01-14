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
    draft: "bg-secondary",
    active: "bg-emerald-100 text-emerald-700",
    closed: "bg-destructive/10 text-destructive",
  };

  return (
    <Card className="group transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <CardHeader className="p-4">
        <div className="flex justify-between items-start gap-4">
          <CardTitle className="text-base font-medium transition-colors duration-200 group-hover:text-primary">
            {title}
          </CardTitle>
          <Badge variant="secondary" className={statusColors[status]}>
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2.5">
        <InfoRow icon={Building2} text={organization} />
        <InfoRow icon={CalendarDays} text={`Deadline: ${deadline}`} />
        <InfoRow icon={FileText} text={`Budget: ${budget}`} />
      </CardContent>
    </Card>
  );
};

const InfoRow = ({ icon: Icon, text }: { icon: any; text: string }) => (
  <div className="flex items-center text-sm text-muted-foreground">
    <Icon className="h-3.5 w-3.5 mr-2 transition-transform duration-200 group-hover:scale-110" />
    <span>{text}</span>
  </div>
);

export default TenderCard;