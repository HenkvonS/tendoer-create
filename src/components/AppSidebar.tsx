import { 
  Home, 
  FileText, 
  Users, 
  Settings2,
  FolderOpen,
  List,
  LayoutGrid,
  Menu,
  UserRound,
  Building2
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTranslation } from "react-i18next"

export function AppSidebar() {
  const { t } = useTranslation()

  const quickActions = [
    {
      title: t('menu.allTenders'),
      url: "/",
      icon: LayoutGrid,
    },
    {
      title: t('menu.recent'),
      url: "/recent",
      icon: List,
    },
  ]

  const workspaces = [
    {
      title: t('menu.activeTenders'),
      url: "/tenders/active",
      icon: FolderOpen,
    },
    {
      title: t('menu.draftTenders'),
      url: "/tenders/drafts",
      icon: FileText,
    },
    {
      title: t('menu.vendors'),
      url: "/vendors",
      icon: Users,
    },
  ]

  const other = [
    {
      title: t('menu.settings'),
      url: "/settings",
      icon: Settings2,
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-3 px-2 py-4">
          <Avatar>
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>
              <UserRound className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Demo User</span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Building2 className="h-3 w-3" />
              <span className="truncate">Demo Organization</span>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Menu className="h-4 w-4" />
                  <span>{t('menu.quickFind')}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Home className="h-4 w-4" />
                  <span>{t('menu.dashboard')}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>{t('menu.quickAccess')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {quickActions.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{t('menu.workspaces')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {workspaces.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {other.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <img 
          src="/lovable-uploads/ef11fbcb-dd0e-41ec-b9f8-a65e87817046.png" 
          alt="Tendoer Logo" 
          className="h-8 w-auto mx-auto opacity-70 group-data-[collapsible=icon]:h-6"
        />
      </SidebarFooter>
    </Sidebar>
  )
}