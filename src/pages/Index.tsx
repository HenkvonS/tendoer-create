import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TenderCard from "@/components/TenderCard";
import StatsCard from "@/components/StatsCard";
import LanguageSelector from "@/components/LanguageSelector";
import { Search, FileText, Users, TrendingUp, AlertCircle, DollarSign, Clock, CheckCircle } from "lucide-react";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, CartesianGrid, Tooltip, Legend } from "recharts";

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

  const monthlyTenders = [
    { month: 'Jan', active: 4, completed: 2, draft: 3 },
    { month: 'Feb', active: 6, completed: 4, draft: 2 },
    { month: 'Mar', active: 5, completed: 3, draft: 4 },
    { month: 'Apr', active: 8, completed: 5, draft: 3 },
    { month: 'May', active: 7, completed: 6, draft: 2 },
    { month: 'Jun', active: 9, completed: 4, draft: 5 },
  ];

  const budgetData = [
    { name: 'Week 1', amount: 500000 },
    { name: 'Week 2', amount: 800000 },
    { name: 'Week 3', amount: 1200000 },
    { name: 'Week 4', amount: 900000 },
  ];

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-2xl font-medium tracking-tight">{t('dashboard.title')}</h1>
          <p className="text-sm text-gray-500">
            {t('dashboard.subtitle')}
          </p>
        </div>
        <LanguageSelector />
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
          description="25% increase from last month"
        />
        <StatsCard
          title={t('stats.totalBudget')}
          value="$3.25M"
          icon={<DollarSign className="h-4 w-4" />}
          description="Total active tender value"
        />
        <StatsCard
          title={t('stats.avgCompletionTime')}
          value="45 days"
          icon={<Clock className="h-4 w-4" />}
          description="Average tender completion time"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-white/50 backdrop-blur-sm p-4">
          <h3 className="font-medium mb-4">Monthly Tender Activity</h3>
          <div className="h-[300px]">
            <ChartContainer
              config={{
                active: { theme: { light: "#1E40AF", dark: "#60A5FA" } },
                completed: { theme: { light: "#059669", dark: "#34D399" } },
                draft: { theme: { light: "#64748b", dark: "#94A3B8" } },
              }}
            >
              <BarChart data={monthlyTenders}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<ChartTooltip />} />
                <Legend />
                <Bar dataKey="active" name="Active" fill="var(--color-active)" />
                <Bar dataKey="completed" name="Completed" fill="var(--color-completed)" />
                <Bar dataKey="draft" name="Draft" fill="var(--color-draft)" />
              </BarChart>
            </ChartContainer>
          </div>
        </div>

        <div className="rounded-lg border bg-white/50 backdrop-blur-sm p-4">
          <h3 className="font-medium mb-4">Budget Allocation Trend</h3>
          <div className="h-[300px]">
            <ChartContainer
              config={{
                amount: { theme: { light: "#1E40AF", dark: "#60A5FA" } },
              }}
            >
              <LineChart data={budgetData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<ChartTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  name="Budget" 
                  stroke="var(--color-amount)"
                  strokeWidth={2}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </div>
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