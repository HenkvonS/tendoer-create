import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Building2, FileText } from "lucide-react";

interface TenderListProps {
  tenders: {
    title: string;
    organization: string;
    deadline: string;
    status: "draft" | "active" | "closed";
    budget: string;
  }[];
}

const TenderList = ({ tenders }: TenderListProps) => {
  const statusColors = {
    draft: "bg-secondary",
    active: "bg-emerald-100 text-emerald-700",
    closed: "bg-destructive/10 text-destructive",
  };

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Organization</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tenders.map((tender, index) => (
            <TableRow key={index} className="group cursor-pointer hover:bg-muted/50">
              <TableCell className="font-medium">{tender.title}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  {tender.organization}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  {tender.deadline}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  {tender.budget}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className={statusColors[tender.status]}>
                  {tender.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TenderList;