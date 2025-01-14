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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold md:text-2xl">{t('dashboard.title')}</h1>
        <p className="text-sm text-muted-foreground">{t('dashboard.subtitle')}</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title={t('stats.totalTenders')}
          value="15"
          icon={<FileText className="h-4 w-4" />}
        />
        <StatsCard
          title={t('stats.activeTenders')}
          value="7"
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

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:scale-110" />
          <Input
            placeholder={t('actions.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 transition-all duration-200 hover:shadow-sm"
          />
        </div>
        <Link to="/tenders/create" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto bg-primary hover:translate-y-0.5 transition-all duration-200 hover:shadow-md">
            {t('actions.createTender')}
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {tenders.map((tender, index) => (
          <TenderCard key={index} {...tender} />
        ))}
      </div>
    </div>
  );
};

export default Index;