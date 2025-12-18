import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ChevronRight, 
  Play, 
  Pause, 
  ArrowLeft,
  Clock,
  Calendar,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppSidebar } from "@/components/AppSidebar";
import { AppBar } from "@/components/AppBar";
import { ExecuteModal } from "@/components/ExecuteModal";
import { AgendaTab } from "@/components/bot-detail/AgendaTab";
import { LogsTab } from "@/components/bot-detail/LogsTab";
import { HistoricoTab } from "@/components/bot-detail/HistoricoTab";
import { ConfiguracoesTab } from "@/components/bot-detail/ConfiguracoesTab";
import { mockBots, Bot } from "@/data/mockBots";
import { SidebarProvider } from "@/components/ui/sidebar";

const statusStyles = {
  Ativo: "bg-status-active/10 text-status-active border-status-active/30",
  Pausado: "bg-status-paused/10 text-status-paused border-status-paused/30",
  Erro: "bg-status-error/10 text-status-error border-status-error/30",
};

export default function BotDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [executeModalOpen, setExecuteModalOpen] = useState(false);
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null);

  // Find bot by id
  const bot = mockBots.find(b => b.id === id);

  if (!bot) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <AppBar title="Detalhe do Bot" showSearch={false} />
            <main className="flex-1 p-6">
              <div className="text-center py-12">
                <p className="text-muted-foreground">Bot não encontrado</p>
                <Button variant="outline" className="mt-4" onClick={() => navigate("/bots")}>
                  Voltar ao Dashboard
                </Button>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  const handleExecute = () => {
    setSelectedBot(bot);
    setExecuteModalOpen(true);
  };

  const isPaused = bot.status === "Pausado";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AppBar title="Detalhe do Bot" showSearch={false} />
          <main className="flex-1 overflow-auto p-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <button 
                onClick={() => navigate("/bots")}
                className="hover:text-foreground transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Bots
              </button>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-medium">{bot.nome}</span>
            </div>

            {/* Header */}
            <div className="bg-surface rounded-xl border border-border p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-foreground">{bot.nome}</h1>
                    <Badge variant="outline" className={statusStyles[bot.status]}>
                      {bot.status}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {bot.proximaExecucao && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Próxima: {bot.proximaExecucao}</span>
                      </div>
                    )}
                    {bot.ultimaExecucao && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Última: {bot.ultimaExecucao}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Activity className="h-4 w-4" />
                      <span>Duração média: {bot.duracaoMedia}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {bot.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="gap-2"
                  >
                    {isPaused ? (
                      <>
                        <Play className="h-4 w-4" />
                        Ativar
                      </>
                    ) : (
                      <>
                        <Pause className="h-4 w-4" />
                        Pausar
                      </>
                    )}
                  </Button>
                  <Button 
                    className="gap-2"
                    onClick={handleExecute}
                  >
                    <Play className="h-4 w-4" />
                    Executar agora
                  </Button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="agenda" className="space-y-6">
              <TabsList className="bg-surface border border-border">
                <TabsTrigger value="agenda">Agenda</TabsTrigger>
                <TabsTrigger value="logs">Logs</TabsTrigger>
                <TabsTrigger value="historico">Histórico</TabsTrigger>
                <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
              </TabsList>

              <TabsContent value="agenda" className="animate-fade-in">
                <AgendaTab />
              </TabsContent>
              
              <TabsContent value="logs" className="animate-fade-in">
                <LogsTab />
              </TabsContent>
              
              <TabsContent value="historico" className="animate-fade-in">
                <HistoricoTab />
              </TabsContent>
              
              <TabsContent value="configuracoes" className="animate-fade-in">
                <ConfiguracoesTab />
              </TabsContent>
            </Tabs>
          </main>
        </div>

        <ExecuteModal
          open={executeModalOpen}
          onOpenChange={setExecuteModalOpen}
          bot={selectedBot}
        />
      </div>
    </SidebarProvider>
  );
}
