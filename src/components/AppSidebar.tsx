
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate, useLocation } from "react-router-dom";
import { FileText, Settings, Users, Globe } from "lucide-react";

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isCurrentPath = (path: string) => {
    return location.pathname === path;
  };

  const routes = [
    {
      icon: FileText,
      label: "Tenders",
      href: "/",
    },
    {
      icon: Globe,
      label: "TED Tenders",
      href: "/tenders/ted",
    },
    {
      icon: Users,
      label: "Vendors",
      href: "/vendors",
    },
    {
      icon: Settings,
      label: "Settings",
      href: "/settings",
    },
  ];

  return (
    <ScrollArea className="h-screen">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant={isCurrentPath(route.href) ? "secondary" : "ghost"}
                className={cn("w-full justify-start")}
                onClick={() => navigate(route.href)}
              >
                <route.icon className="mr-2 h-4 w-4" />
                {route.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default AppSidebar;
