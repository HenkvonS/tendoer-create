import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Building2, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TenderCardProps {
  id: string;
  title: string;
  organization: string;
  deadline: string;
  status: "draft" | "active" | "closed";
  budget: string;
}

const TenderCard = ({ id, title, organization, deadline, status, budget }: TenderCardProps) => {
  const navigate = useNavigate();
  
  const statusColors = {
    draft: "bg-secondary",
    active: "bg-emerald-100 text-emerald-700",
    closed: "bg-destructive/10 text-destructive",
  };

  return (
    <Card 
      className="group cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
      onClick={() => navigate(`/tenders/edit/${id}`)}
    >
      <CardHeader className="p-3 sm:p-4">
        <div className="flex justify-between items-start gap-2 sm:gap-4">
          <CardTitle className="text-sm sm:text-base font-medium transition-colors duration-200 group-hover:text-primary line-clamp-2">
            {title}
          </CardTitle>
          <Badge variant="secondary" className={`${statusColors[status]} shrink-0`}>
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 pt-0 space-y-2">
        <InfoRow icon={Building2} text={organization} />
        <InfoRow icon={CalendarDays} text={`Deadline: ${deadline}`} />
        <InfoRow icon={FileText} text={`Budget: ${budget}`} />
      </CardContent>
    </Card>
  );
};

const InfoRow = ({ icon: Icon, text }: { icon: any; text: string }) => (
  <div className="flex items-center text-sm text-muted-foreground">
    <Icon className="h-3.5 w-3.5 mr-2 transition-transform duration-200 group-hover:scale-110 shrink-0" />
    <span className="line-clamp-1">{text}</span>
  </div>
);

export default TenderCard;