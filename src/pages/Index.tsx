import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TenderCard from "@/components/TenderCard";
import StatsCard from "@/components/StatsCard";
import { Search, FileText, Users, TrendingUp, AlertCircle } from "lucide-react";

const Index = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

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
    }
  ];

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto">
      <div>
        <h1 className="text-xl font-bold">{t('dashboard.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('dashboard.subtitle')}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title={t('stats.totalTenders')}
          value="12"
          icon={<FileText className="h-4 w-4" />}
        />
        <StatsCard
          title={t('stats.activeTenders')}
          value="4"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatsCard
          title={t('stats.participatingVendors')}
          value="28"
          icon={<Users className="h-4 w-4" />}
        />
        <StatsCard
          title={t('stats.pendingReviews')}
          value="3"
          icon={<AlertCircle className="h-4 w-4" />}
        />
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:scale-110" />
          <Input
            placeholder={t('actions.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 transition-all duration-200 hover:shadow-sm"
          />
        </div>
        <Link to="/tenders/create">
          <Button className="bg-primary hover:translate-y-0.5 transition-all duration-200 hover:shadow-md">
            {t('actions.createTender')}
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tenders.map((tender, index) => (
          <TenderCard key={index} {...tender} />
        ))}
      </div>
    </div>
  );
};

export default Index;
