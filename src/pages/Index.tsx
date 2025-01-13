import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TenderCard from "@/components/TenderCard";
import StatsCard from "@/components/StatsCard";
import { Search, FileText, Users, TrendingUp, AlertCircle } from "lucide-react";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for demonstration
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
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Tender Management Dashboard</h1>
        <p className="text-muted-foreground">
          Manage and track all your tender processes efficiently
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Tenders"
          value="12"
          icon={<FileText className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Active Tenders"
          value="4"
          icon={<TrendingUp className="h-4 w-4 text-success" />}
        />
        <StatsCard
          title="Participating Vendors"
          value="28"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Pending Reviews"
          value="3"
          icon={<AlertCircle className="h-4 w-4 text-destructive" />}
        />
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tenders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button>Create Tender</Button>
      </div>

      {/* Tenders Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tenders.map((tender, index) => (
          <TenderCard key={index} {...tender} />
        ))}
      </div>
    </div>
  );
};

export default Index;
