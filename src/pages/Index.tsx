import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TenderCard from "@/components/TenderCard";
import StatsCard from "@/components/StatsCard";
import { FileText, Users, TrendingUp, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: tenders = [], isLoading: isLoadingTenders } = useQuery({
    queryKey: ['tenders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error fetching tenders",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }

      return data;
    },
  });

  const stats = {
    totalTenders: tenders.length,
    activeTenders: tenders.filter(t => t.status === 'active').length,
    participatingVendors: 28, // This would come from vendors table in the future
    pendingReviews: tenders.filter(t => t.status === 'draft').length,
  };

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">
          {t('dashboard.title')}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t('dashboard.subtitle')}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title={t('stats.totalTenders')}
          value={stats.totalTenders}
          icon={<FileText className="h-4 w-4" />}
        />
        <StatsCard
          title={t('stats.activeTenders')}
          value={stats.activeTenders}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatsCard
          title={t('stats.participatingVendors')}
          value={stats.participatingVendors}
          icon={<Users className="h-4 w-4" />}
        />
        <StatsCard
          title={t('stats.pendingReviews')}
          value={stats.pendingReviews}
          icon={<AlertCircle className="h-4 w-4" />}
        />
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Input
            placeholder={t('actions.search')}
            className="pl-9"
          />
          <span className="absolute left-3 top-2.5">
            <svg
              className="h-4 w-4 text-muted-foreground"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
        </div>
        <Button 
          onClick={() => navigate('/tenders/create')}
          className="bg-primary hover:bg-primary/90"
        >
          {t('actions.createTender')}
        </Button>
      </div>

      {isLoadingTenders ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-[200px] rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tenders.map((tender) => (
            <TenderCard
              key={tender.id}
              title={tender.title}
              organization="Your Organization" // This should come from profiles table
              deadline={new Date(tender.deadline).toLocaleDateString()}
              status={tender.status}
              budget={`$${tender.budget?.toLocaleString()}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Index;