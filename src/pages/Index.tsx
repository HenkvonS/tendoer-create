import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TenderCard from "@/components/TenderCard";
import TenderList from "@/components/TenderList";
import StatsCard from "@/components/StatsCard";
import { Search, FileText, Users, TrendingUp, AlertCircle, LayoutGrid, List, ArrowUpDown } from "lucide-react";
import { sortTenders, SortConfig } from "@/utils/sortTenders";

const Index = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [organizationFilter, setOrganizationFilter] = useState<string>("all");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: "deadline",
    order: "desc",
  });

  const tenders = [
    {
      title: "IT Infrastructure Upgrade",
      organization: "Ministry of Technology",
      deadline: "2024-04-15",
      status: "active" as const,
      budget: "$500,000",
    },
    {
      title: "Public Transportation System",
      organization: "Department of Transport",
      deadline: "2024-05-01",
      status: "draft" as const,
      budget: "$2,000,000",
    },
    {
      title: "Healthcare Equipment Supply",
      organization: "Health Department",
      deadline: "2024-03-30",
      status: "closed" as const,
      budget: "$750,000",
    },
    {
      title: "Smart City Lighting Project",
      organization: "City Council",
      deadline: "2024-06-20",
      status: "active" as const,
      budget: "$1,200,000",
    },
    {
      title: "School Renovation Program",
      organization: "Education Board",
      deadline: "2024-05-15",
      status: "active" as const,
      budget: "$3,500,000",
    },
    {
      title: "Waste Management System",
      organization: "Environmental Agency",
      deadline: "2024-04-30",
      status: "draft" as const,
      budget: "$800,000",
    },
    {
      title: "Emergency Response Vehicles",
      organization: "Fire Department",
      deadline: "2024-03-25",
      status: "closed" as const,
      budget: "$1,500,000",
    },
    {
      title: "Parks Maintenance Services",
      organization: "Parks & Recreation",
      deadline: "2024-07-01",
      status: "active" as const,
      budget: "$300,000",
    },
    {
      title: "Digital Archives System",
      organization: "National Library",
      deadline: "2024-06-15",
      status: "draft" as const,
      budget: "$450,000",
    },
    {
      title: "Water Treatment Plant Upgrade",
      organization: "Water Resources Department",
      deadline: "2024-08-30",
      status: "active" as const,
      budget: "$4,200,000",
    },
    {
      title: "Solar Panel Installation Project",
      organization: "Energy Commission",
      deadline: "2024-07-15",
      status: "draft" as const,
      budget: "$2,800,000",
    },
    {
      title: "Road Infrastructure Maintenance",
      organization: "Highway Authority",
      deadline: "2024-09-01",
      status: "active" as const,
      budget: "$5,500,000",
    },
    {
      title: "Public Housing Development",
      organization: "Housing Department",
      deadline: "2024-08-15",
      status: "draft" as const,
      budget: "$7,200,000",
    },
    {
      title: "Municipal Waste Recycling Program",
      organization: "Environmental Protection Agency",
      deadline: "2024-07-30",
      status: "active" as const,
      budget: "$900,000",
    },
    {
      title: "Public Library Modernization",
      organization: "Cultural Affairs Department",
      deadline: "2024-08-20",
      status: "draft" as const,
      budget: "$650,000",
    }
  ];

  // Get unique organizations for the filter
  const organizations = Array.from(new Set(tenders.map(tender => tender.organization)));

  // Filter tenders based on search query, status, and organization
  const filteredTenders = tenders.filter(tender => {
    const matchesSearch = tender.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || tender.status === statusFilter;
    const matchesOrg = organizationFilter === "all" || tender.organization === organizationFilter;
    return matchesSearch && matchesStatus && matchesOrg;
  });

  // Sort the filtered tenders
  const sortedTenders = sortTenders(filteredTenders, sortConfig);

  // Calculate stats based on filtered tenders
  const activeTenders = sortedTenders.filter(t => t.status === "active").length;

  const handleSort = (field: SortConfig["field"]) => {
    setSortConfig(current => ({
      field,
      order: current.field === field && current.order === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold md:text-2xl">{t('dashboard.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('dashboard.subtitle')}</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title={t('stats.totalTenders')}
          value={sortedTenders.length.toString()}
          icon={<FileText className="h-4 w-4" />}
        />
        <StatsCard
          title={t('stats.activeTenders')}
          value={activeTenders.toString()}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatsCard
          title={t('stats.participatingVendors')}
          value="42"
          icon={<Users className="h-4 w-4" />}
        />
        <StatsCard
          title={t('stats.pendingReviews')}
          value="5"
          icon={<AlertCircle className="h-4 w-4" />}
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:scale-110" />
            <Input
              placeholder={t('actions.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 transition-all duration-200 hover:shadow-sm"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={organizationFilter} onValueChange={setOrganizationFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by organization" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Organizations</SelectItem>
              {organizations.map((org) => (
                <SelectItem key={org} value={org}>
                  {org}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-4">
          <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as "grid" | "list")}>
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List view">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          <Link to="/tenders/create">
            <Button className="bg-primary hover:translate-y-0.5 transition-all duration-200 hover:shadow-md">
              {t('actions.createTender')}
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["title", "organization", "deadline", "budget", "status"].map((field) => (
          <Button
            key={field}
            variant="outline"
            size="sm"
            onClick={() => handleSort(field as SortConfig["field"])}
            className={`flex items-center gap-1 ${
              sortConfig.field === field ? "bg-muted" : ""
            }`}
          >
            {t(field)}
            <ArrowUpDown className="h-3 w-3" />
          </Button>
        ))}
      </div>

      {viewMode === "grid" ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {sortedTenders.map((tender, index) => (
            <TenderCard key={index} {...tender} />
          ))}
        </div>
      ) : (
        <TenderList tenders={sortedTenders} />
      )}
    </div>
  );
};

export default Index;
