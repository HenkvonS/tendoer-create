import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TenderCard from "@/components/TenderCard";
import StatsCard from "@/components/StatsCard";
import { Search, FileText, Users, TrendingUp, AlertCircle } from "lucide-react";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation();

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
  ];

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto">
      <div className="space-y-1">
        <h1 className="text-2xl font-medium tracking-tight">{t('dashboard.title')}</h1>
        <p className="text-sm text-gray-500">
          {t('dashboard.subtitle')}
        </p>
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

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder={t('actions.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white/50 backdrop-blur-sm border-gray-200"
          />
        </div>
        <Button variant="outline" className="bg-white hover:bg-gray-50">
          {t('actions.createTender')}
        </Button>
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