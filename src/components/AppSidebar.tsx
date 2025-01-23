import { 
  Home, 
  FileText, 
  Users, 
  Settings, 
  LogOut, 
  FolderOpen,
  List,
  LayoutGrid,
  Menu,
  Settings2,
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
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useTranslation } from "react-i18next"
import { useEffect, useState } from "react"

export function AppSidebar() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { t } = useTranslation()
  const [organization, setOrganization] = useState("")
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setUser(user)
          const { data: profiles, error } = await supabase
            .from('profiles')
            .select('organization_name')
            .single()

          if (error) throw error
          if (profiles) {
            setOrganization(profiles.organization_name)
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      }
    }

    getProfile()
  }, [])

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

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      toast({
        title: t('menu.logout'),
        description: "You have been successfully logged out.",
      })
      
      navigate("/login")
    } catch (error) {
      console.error("Error logging out:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out. Please try again.",
      })
    }
  }

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
            <span className="text-sm font-medium">{user?.email || 'Loading...'}</span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Building2 className="h-3 w-3" />
              <span>{organization || 'Loading...'}</span>
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
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  <span>{t('menu.logout')}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}