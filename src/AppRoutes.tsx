import { Routes, Route } from "react-router-dom"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { ThemeToggle } from "@/components/ThemeToggle"
import LanguageSelector from "@/components/LanguageSelector"
import Index from "./pages/Index"
import Login from "./pages/auth/Login"
import CreateTender from "./pages/tenders/Create"
import EditTender from "./pages/tenders/Edit"
import VendorsIndex from "./pages/vendors/Index"
import Settings from "./pages/settings/Index"
import AISettings from "./pages/settings/AISettings"
import "./i18n/config"

const AppRoutes = () => {
  return (
    <TooltipProvider>
      <Toaster />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <SidebarProvider>
              <div className="flex min-h-screen w-full">
                <AppSidebar />
                <main className="flex-1">
                  <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="flex h-10 items-center justify-between px-3">
                      <SidebarTrigger />
                      <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <LanguageSelector />
                      </div>
                    </div>
                  </header>
                  <div className="p-4">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/tenders/create" element={<CreateTender />} />
                      <Route path="/tenders/edit/:id" element={<EditTender />} />
                      <Route path="/vendors" element={<VendorsIndex />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/settings/ai" element={<AISettings />} />
                    </Routes>
                  </div>
                </main>
              </div>
            </SidebarProvider>
          }
        />
      </Routes>
    </TooltipProvider>
  )
}

export default AppRoutes