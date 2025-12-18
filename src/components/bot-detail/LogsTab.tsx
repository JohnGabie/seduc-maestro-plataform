import { useState } from "react";
import { Search, Filter, AlertCircle, AlertTriangle, Info, Bug } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockLogs, LogEntry } from "@/data/mockLogs";

const levelConfig = {
  info: { icon: Info, color: "text-blue-400", bg: "bg-blue-400/10", label: "Info" },
  warn: { icon: AlertTriangle, color: "text-status-paused", bg: "bg-status-paused/10", label: "Aviso" },
  error: { icon: AlertCircle, color: "text-status-error", bg: "bg-status-error/10", label: "Erro" },
  debug: { icon: Bug, color: "text-purple-400", bg: "bg-purple-400/10", label: "Debug" },
};

export function LogsTab() {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<string | null>(null);
  const [logs] = useState<LogEntry[]>(mockLogs);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(search.toLowerCase()) ||
                          log.details?.toLowerCase().includes(search.toLowerCase());
    const matchesLevel = !levelFilter || log.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const toggleLevelFilter = (level: string) => {
    setLevelFilter(levelFilter === level ? null : level);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar nos logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-surface border-border"
          />
        </div>
        <div className="flex gap-2">
          {Object.entries(levelConfig).map(([level, config]) => (
            <Button
              key={level}
              variant={levelFilter === level ? "default" : "outline"}
              size="sm"
              onClick={() => toggleLevelFilter(level)}
              className="gap-1"
            >
              <config.icon className="h-3 w-3" />
              {config.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Logs List */}
      <div className="bg-surface rounded-lg border border-border overflow-hidden">
        {filteredLogs.length > 0 ? (
          <div className="divide-y divide-border">
            {filteredLogs.map(log => {
              const config = levelConfig[log.level];
              const Icon = config.icon;
              
              return (
                <div key={log.id} className="p-3 hover:bg-surface-alt transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`p-1.5 rounded ${config.bg} mt-0.5`}>
                      <Icon className={`h-4 w-4 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-muted-foreground font-mono">
                          {log.timestamp}
                        </span>
                        <Badge variant="outline" className={`text-xs ${config.color} border-current`}>
                          {config.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground">{log.message}</p>
                      {log.details && (
                        <p className="text-xs text-muted-foreground mt-1 font-mono bg-background/50 px-2 py-1 rounded">
                          {log.details}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum log encontrado</p>
            {(search || levelFilter) && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-2"
                onClick={() => { setSearch(""); setLevelFilter(null); }}
              >
                Limpar filtros
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Pagination placeholder */}
      {filteredLogs.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Mostrando {filteredLogs.length} de {logs.length} logs</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Anterior</Button>
            <Button variant="outline" size="sm" disabled>Próximo</Button>
          </div>
        </div>
      )}
    </div>
  );
}
