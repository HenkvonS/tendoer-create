
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Building2, FileText, ArrowUp, ArrowDown, Globe } from "lucide-react";
import { SortConfig } from "@/utils/sortTenders";
import { useNavigate } from "react-router-dom";

interface TenderListProps {
  tenders: {
    id: string;
    title: string;
    organization: string;
    deadline: string;
    status: "draft" | "active" | "closed";
    budget: string;
    source?: "local" | "ted";
    country?: string;
  }[];
  sortConfig?: SortConfig;
  onSort?: (field: SortConfig["field"]) => void;
}

const TenderList = ({ tenders, sortConfig, onSort }: TenderListProps) => {
  const navigate = useNavigate();
  
  const statusColors = {
    draft: "bg-secondary",
    active: "bg-emerald-100 text-emerald-700",
    closed: "bg-destructive/10 text-destructive",
  };

  const SortIndicator = ({ field }: { field: SortConfig["field"] }) => {
    if (!sortConfig || sortConfig.field !== field) return null;
    return sortConfig.order === "asc" ? (
      <ArrowUp className="h-3 w-3 ml-1" />
    ) : (
      <ArrowDown className="h-3 w-3 ml-1" />
    );
  };

  const handleRowClick = (id: string, source: string) => {
    if (source === 'ted') {
      window.open(`https://ted.europa.eu/udl?uri=TED:NOTICE:${id}`, '_blank');
    } else {
      navigate(`/tenders/edit/${id}`);
    }
  };

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => onSort?.("title")}>
              <div className="flex items-center">
                Title
                <SortIndicator field="title" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => onSort?.("organization")}>
              <div className="flex items-center">
                Organization
                <SortIndicator field="organization" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => onSort?.("deadline")}>
              <div className="flex items-center">
                Deadline
                <SortIndicator field="deadline" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => onSort?.("budget")}>
              <div className="flex items-center">
                Budget
                <SortIndicator field="budget" />
              </div>
            </TableHead>
            <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => onSort?.("status")}>
              <div className="flex items-center">
                Status
                <SortIndicator field="status" />
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tenders.map((tender) => (
            <TableRow 
              key={tender.id} 
              className="group cursor-pointer hover:bg-muted/50"
              onClick={() => handleRowClick(tender.id, tender.source || 'local')}
            >
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {tender.source === 'ted' && (
                    <Globe className="h-4 w-4 text-blue-500" />
                  )}
                  {tender.title}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  {tender.organization}
                  {tender.country && (
                    <span className="text-xs text-muted-foreground">
                      ({tender.country})
                    </span>
                  )}
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
