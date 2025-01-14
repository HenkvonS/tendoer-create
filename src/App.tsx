import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import LanguageSelector from "@/components/LanguageSelector"
import { ThemeProvider } from "@/components/ThemeProvider"
import { ThemeToggle } from "@/components/ThemeToggle"
import Index from "./pages/Index"
import Login from "./pages/auth/Login"
import CreateTender from "./pages/tenders/Create"
import "./i18n/config"

const queryClient = new QueryClient()

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={
              <SidebarProvider>
                <div className="flex min-h-screen w-full">
                  <AppSidebar />
                  <main className="flex-1">
                    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                      <div className="flex h-14 items-center justify-between px-4">
                        <SidebarTrigger />
                        <div className="flex items-center gap-2 sm:gap-4">
                          <ThemeToggle />
                          <LanguageSelector />
                        </div>
                      </div>
                    </header>
                    <div className="p-4">
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/tenders/create" element={<CreateTender />} />
                      </Routes>
                    </div>
                  </main>
                </div>
              </SidebarProvider>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
)

export default App