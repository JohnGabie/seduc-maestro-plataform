import { useState, useEffect } from "react";
import { AppSidebar, MobileMenuButton } from "@/components/AppSidebar";
import { AppBar } from "@/components/AppBar";
import { mockBots, Bot } from "@/data/mockBots";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Play,
  Pause,
  Square,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Activity,
  Zap,
  RefreshCw,
} from "lucide-react";

interface ActiveExecution {
  id: string;
  bot: Bot;
  startedAt: string;
  progress: number;
  status: "running" | "paused" | "completed" | "failed";
  recordsProcessed: number;
  estimatedTimeLeft: string;
}

const statusConfig = {
  running: { icon: Loader2, color: "text-primary", bg: "bg-primary/10", label: "Em execução", iconClass: "animate-spin" },
  paused: { icon: Pause, color: "text-warning", bg: "bg-warning/10", label: "Pausado", iconClass: "" },
  completed: { icon: CheckCircle, color: "text-success", bg: "bg-success/10", label: "Concluído", iconClass: "" },
  failed: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", label: "Falhou", iconClass: "" },
};

const mockExecutions: ActiveExecution[] = [
  {
    id: "exec-1",
    bot: mockBots[0],
    startedAt: "Há 3 min",
    progress: 67,
    status: "running",
    recordsProcessed: 30,
    estimatedTimeLeft: "~4 min",
  },
  {
    id: "exec-2",
    bot: mockBots[2],
    startedAt: "Há 12 min",
    progress: 85,
    status: "running",
    recordsProcessed: 120,
    estimatedTimeLeft: "~6 min",
  },
  {
    id: "exec-3",
    bot: mockBots[4],
    startedAt: "Há 25 min",
    progress: 100,
    status: "completed",
    recordsProcessed: 45,
    estimatedTimeLeft: "-",
  },
];

export default function Execucoes() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [executions, setExecutions] = useState<ActiveExecution[]>(mockExecutions);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulate progress update
  useEffect(() => {
    const interval = setInterval(() => {
      setExecutions(prev =>
        prev.map(exec => {
          if (exec.status === "running" && exec.progress < 100) {
            const newProgress = Math.min(exec.progress + Math.random() * 3, 100);
            return {
              ...exec,
              progress: Math.round(newProgress),
              recordsProcessed: exec.recordsProcessed + Math.floor(Math.random() * 2),
              status: newProgress >= 100 ? "completed" : "running",
            };
          }
          return exec;
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const stats = {
    running: executions.filter(e => e.status === "running").length,
    completed: executions.filter(e => e.status === "completed").length,
    failed: executions.filter(e => e.status === "failed").length,
    total: executions.length,
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />

      <div className="flex-1 flex flex-col">
        <AppBar
          title="Execuções"
          showSearch={false}
          leftContent={<MobileMenuButton onClick={() => setMobileMenuOpen(true)} />}
        />

        <main className="flex-1 p-4 md:p-6 animate-page-in">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Activity className="h-4 w-4" />
                <span className="text-sm">Total</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 text-primary mb-1">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Em Execução</span>
              </div>
              <p className="text-2xl font-bold text-primary">{stats.running}</p>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 text-success mb-1">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Concluídas</span>
              </div>
              <p className="text-2xl font-bold text-success">{stats.completed}</p>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 text-destructive mb-1">
                <XCircle className="h-4 w-4" />
                <span className="text-sm">Falhas</span>
              </div>
              <p className="text-2xl font-bold text-destructive">{stats.failed}</p>
            </div>
          </div>

          {/* Active Executions */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <h2 className="font-semibold text-foreground">Execuções Ativas</h2>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="border-border"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                Atualizar
              </Button>
            </div>

            <div className="divide-y divide-border">
              {executions.length === 0 ? (
                <div className="p-8 text-center">
                  <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">Nenhuma execução ativa</p>
                </div>
              ) : (
                executions.map(exec => {
                  const config = statusConfig[exec.status];
                  const StatusIcon = config.icon;

                  return (
                    <div key={exec.id} className="p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        {/* Bot Info */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className={`p-2 rounded-lg ${config.bg}`}>
                            <StatusIcon className={`h-5 w-5 ${config.color} ${config.iconClass}`} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground truncate">{exec.bot.nome}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>Iniciado {exec.startedAt}</span>
                            </div>
                          </div>
                        </div>

                        {/* Progress */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              {exec.recordsProcessed} registros processados
                            </span>
                            <span className="font-medium text-foreground">{exec.progress}%</span>
                          </div>
                          <Progress value={exec.progress} className="h-2" />
                        </div>

                        {/* Status & Actions */}
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className={`${config.color} border-current`}>
                            {config.label}
                          </Badge>
                          {exec.status === "running" && (
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {exec.estimatedTimeLeft}
                            </span>
                          )}
                          <div className="flex gap-1">
                            {exec.status === "running" && (
                              <>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Pause className="h-4 w-4 text-muted-foreground" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Square className="h-4 w-4 text-destructive" />
                                </Button>
                              </>
                            )}
                            {exec.status === "paused" && (
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Play className="h-4 w-4 text-success" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
