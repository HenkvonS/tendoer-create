import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
}

const StatsCard = ({ title, value, icon, description }: StatsCardProps) => (
  <Card className="border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
    <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 sm:p-4">
      <CardTitle className="text-sm font-medium line-clamp-1">{title}</CardTitle>
      <div className="transition-transform duration-200 hover:scale-110 shrink-0 ml-2">{icon}</div>
    </CardHeader>
    <CardContent className="p-3 sm:p-4 pt-0">
      <div className="text-xl sm:text-2xl font-semibold">{value}</div>
      {description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{description}</p>}
    </CardContent>
  </Card>
);

export default StatsCard;