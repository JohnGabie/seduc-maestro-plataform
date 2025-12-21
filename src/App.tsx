import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import BotDetail from "./pages/BotDetail";
import Logs from "./pages/Logs";
import Agenda from "./pages/Agenda";
import Execucoes from "./pages/Execucoes";
import Configuracoes from "./pages/Configuracoes";
import Alertas from "./pages/Alertas";
import Usuarios from "./pages/Usuarios";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/bots" element={<Dashboard />} />
          <Route path="/bots/:id" element={<BotDetail />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/execucoes" element={<Execucoes />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="/alertas" element={<Alertas />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
