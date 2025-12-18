import { useState } from "react";
import { CheckCircle, XCircle, Ban, Clock, FileText, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockHistory, ExecutionHistory } from "@/data/mockLogs";

const statusConfig = {
  Sucesso: { icon: CheckCircle, color: "text-status-active", bg: "bg-status-active/10" },
  Falha: { icon: XCircle, color: "text-status-error", bg: "bg-status-error/10" },
  Cancelado: { icon: Ban, color: "text-muted-foreground", bg: "bg-muted/10" },
};

export function HistoricoTab() {
  const [history] = useState<ExecutionHistory[]>(mockHistory);

  const stats = {
    total: history.length,
    sucesso: history.filter(h => h.status === "Sucesso").length,
    falha: history.filter(h => h.status === "Falha").length,
    cancelado: history.filter(h => h.status === "Cancelado").length,
  };

  const taxaSucesso = stats.total > 0 ? Math.round((stats.sucesso / stats.total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface rounded-lg border border-border p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <FileText className="h-4 w-4" />
            <span className="text-sm">Total</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
        </div>
        <div className="bg-surface rounded-lg border border-border p-4">
          <div className="flex items-center gap-2 text-status-active mb-1">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">Sucesso</span>
          </div>
          <p className="text-2xl font-bold text-status-active">{stats.sucesso}</p>
        </div>
        <div className="bg-surface rounded-lg border border-border p-4">
          <div className="flex items-center gap-2 text-status-error mb-1">
            <XCircle className="h-4 w-4" />
            <span className="text-sm">Falhas</span>
          </div>
          <p className="text-2xl font-bold text-status-error">{stats.falha}</p>
        </div>
        <div className="bg-surface rounded-lg border border-border p-4">
          <div className="flex items-center gap-2 text-primary mb-1">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">Taxa de Sucesso</span>
          </div>
          <p className="text-2xl font-bold text-primary">{taxaSucesso}%</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-surface rounded-lg border border-border">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Histórico de Execuções</h3>
        </div>
        <div className="divide-y divide-border">
          {history.map((exec, index) => {
            const config = statusConfig[exec.status];
            const Icon = config.icon;
            
            return (
              <div key={exec.id} className="p-4 hover:bg-surface-alt transition-colors">
                <div className="flex items-start gap-4">
                  {/* Timeline indicator */}
                  <div className="flex flex-col items-center">
                    <div className={`p-2 rounded-full ${config.bg}`}>
                      <Icon className={`h-4 w-4 ${config.color}`} />
                    </div>
                    {index < history.length - 1 && (
                      <div className="w-0.5 h-full bg-border mt-2 min-h-[20px]" />
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={`${config.color} border-current`}
                        >
                          {exec.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{exec.dataHora}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {exec.duracao}
                      </div>
                    </div>
                    
                    {exec.registrosProcessados && (
                      <p className="text-sm text-foreground">
                        {exec.registrosProcessados} registros processados
                      </p>
                    )}
                    
                    {exec.erro && (
                      <p className="text-sm text-status-error mt-1">
                        Erro: {exec.erro}
                      </p>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    Ver logs
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
