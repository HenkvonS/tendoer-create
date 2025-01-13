import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TenderCard from "@/components/TenderCard";
import StatsCard from "@/components/StatsCard";
import { Search, FileText, Users, TrendingUp, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: tenders = [], isLoading } = useQuery({
    queryKey: ['tenders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenders')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatBudget = (budget: number | null) => {
    if (!budget) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(budget);
  };

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {t('dashboard.title')}
        </h1>
        <p className="text-sm text-gray-500">
          {t('dashboard.subtitle')}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title={t('stats.totalTenders')}
          value={tenders.length.toString()}
          icon={<FileText className="h-4 w-4" />}
        />
        <StatsCard
          title={t('stats.activeTenders')}
          value={tenders.filter(t => t.status === 'active').length.toString()}
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
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder={t('actions.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white border border-gray-200 hover:border-gray-300 focus:border-gray-300 focus:ring-0"
          />
        </div>
        <Button 
          className="bg-gray-900 hover:bg-gray-800 text-white border-0"
          onClick={() => navigate('/tenders/create')}
        >
          {t('actions.createTender')}
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading tenders...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tenders.map((tender) => (
            <TenderCard
              key={tender.id}
              title={tender.title}
              organization="Organization Name" // This would come from the profiles table in a future update
              deadline={tender.deadline ? formatDate(tender.deadline) : 'No deadline set'}
              status={tender.status as "draft" | "active" | "closed"}
              budget={formatBudget(tender.budget)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Index;