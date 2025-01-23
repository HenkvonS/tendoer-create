import { BrowserRouter as Router } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "@/components/ThemeProvider"
import { Toaster } from "@/components/ui/toaster"
import AppRoutes from "./AppRoutes"
import "./App.css"

const queryClient = new QueryClient()

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AppRoutes />
          <Toaster />
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App