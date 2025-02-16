
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import TenderList from "@/components/TenderList";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { RefreshCw, Globe } from "lucide-react";
import { useState } from "react";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PAGE_SIZE = 10;

const TEDTenders = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['ted-tenders', currentPage],
    queryFn: async () => {
      const start = (currentPage - 1) * PAGE_SIZE;
      const end = start + PAGE_SIZE - 1;

      const { data, error, count } = await supabase
        .from('ted_tenders')
        .select('*', { count: 'exact' })
        .order('publication_date', { ascending: false })
        .range(start, end);

      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }

      console.log('Fetched tenders:', data);

      return {
        tenders: data?.map(tender => ({
          id: tender.id.toString(),
          title: tender.title,
          organization: tender.buyer_name || 'Unknown',
          deadline: new Date(tender.publication_date).toLocaleDateString(),
          status: 'active' as const,
          budget: tender.value_amount ? 
            `${tender.value_amount} ${tender.value_currency}` : 
            'Not specified',
          source: 'ted' as const,
          country: tender.buyer_country
        })) || [],
        totalCount: count || 0
      };
    }
  });

  const totalPages = Math.ceil((data?.totalCount || 0) / PAGE_SIZE);

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      const response = await supabase.functions.invoke('fetch-ted-tenders');
      
      console.log('Refresh response:', response);
      
      if (response.error) {
        throw new Error(response.error.message || 'Failed to refresh TED tenders');
      }
      
      if (response.data.success) {
        toast.success(response.data.message);
        await refetch();
      } else {
        throw new Error(response.data.error || 'Failed to refresh TED tenders');
      }
    } catch (error) {
      console.error('Refresh error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to refresh tenders');
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="h-6 w-6 text-blue-500" />
          <h1 className="text-2xl font-bold">TED Tenders</h1>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Showing {data?.tenders.length || 0} of {data?.totalCount || 0} tenders
          </p>
          <Button 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Tenders
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-[400px] w-full" />
        </div>
      ) : data?.tenders.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No tenders found. Click refresh to fetch the latest tenders.
        </div>
      ) : (
        <>
          <TenderList 
            tenders={data?.tenders || []}
          />
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => currentPage > 1 && setCurrentPage(p => p - 1)}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  aria-disabled={currentPage === 1}
                />
              </PaginationItem>
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    onClick={() => setCurrentPage(i + 1)}
                    isActive={currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext 
                  onClick={() => currentPage < totalPages && setCurrentPage(p => p + 1)}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  aria-disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </>
      )}
    </div>
  );
};

export default TEDTenders;
