import { useState, useMemo } from "react";
import { AppSidebar, MobileMenuButton } from "@/components/AppSidebar";
import { AppBar } from "@/components/AppBar";
import { mockLogs, LogEntry } from "@/data/mockLogs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  AlertTriangle,
  Info,
  Bug,
  Download,
} from "lucide-react";

const levelConfig = {
  info: { icon: Info, color: "text-info", bg: "bg-info/10", label: "Info" },
  warn: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10", label: "Aviso" },
  error: { icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10", label: "Erro" },
  debug: { icon: Bug, color: "text-muted-foreground", bg: "bg-muted/10", label: "Debug" },
};

export default function Logs() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [logs] = useState<LogEntry[]>(mockLogs);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        searchQuery === "" ||
        log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesLevel = levelFilter === "all" || log.level === levelFilter;
      
      return matchesSearch && matchesLevel;
    });
  }, [logs, searchQuery, levelFilter]);

  const stats = useMemo(() => ({
    total: logs.length,
    info: logs.filter(l => l.level === "info").length,
    warn: logs.filter(l => l.level === "warn").length,
    error: logs.filter(l => l.level === "error").length,
  }), [logs]);

  const exportLogs = () => {
    const csvContent = [
      ["Timestamp", "Nível", "Mensagem", "Detalhes"].join(","),
      ...filteredLogs.map(log => [
        log.timestamp,
        log.level,
        `"${log.message}"`,
        `"${log.details || ""}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `logs_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar mobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />

      <div className="flex-1 flex flex-col">
        <AppBar
          title="Central de Logs"
          showSearch={false}
          leftContent={<MobileMenuButton onClick={() => setMobileMenuOpen(true)} />}
        />

        <main className="flex-1 p-4 md:p-6 animate-page-in">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-card rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground mb-1">Total</p>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <p className="text-sm text-info mb-1">Info</p>
              <p className="text-2xl font-bold text-info">{stats.info}</p>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <p className="text-sm text-warning mb-1">Avisos</p>
              <p className="text-2xl font-bold text-warning">{stats.warn}</p>
            </div>
            <div className="bg-card rounded-lg border border-border p-4">
              <p className="text-sm text-destructive mb-1">Erros</p>
              <p className="text-2xl font-bold text-destructive">{stats.error}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-card rounded-lg border border-border p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar nos logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-secondary border-border"
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger className="w-[140px] bg-secondary border-border">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warn">Aviso</SelectItem>
                    <SelectItem value="error">Erro</SelectItem>
                    <SelectItem value="debug">Debug</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" size="icon" className="border-border">
                  <RefreshCw className="h-4 w-4" />
                </Button>

                <Button variant="outline" onClick={exportLogs} className="border-border">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>
          </div>

          {/* Log List */}
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold text-foreground">Logs</h2>
              <Badge variant="secondary">{filteredLogs.length} registros</Badge>
            </div>
            
            <div className="divide-y divide-border max-h-[600px] overflow-y-auto scrollbar-dark">
              {filteredLogs.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Nenhum log encontrado</p>
                </div>
              ) : (
                filteredLogs.map((log) => {
                  const config = levelConfig[log.level];
                  const Icon = config.icon;
                  
                  return (
                    <div
                      key={log.id}
                      className="p-4 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${config.bg}`}>
                          <Icon className={`h-4 w-4 ${config.color}`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                            <Badge
                              variant="outline"
                              className={`${config.color} border-current w-fit text-xs`}
                            >
                              {config.label}
                            </Badge>
                            <span className="text-xs text-muted-foreground font-mono">
                              {log.timestamp}
                            </span>
                          </div>
                          
                          <p className="text-sm text-foreground">{log.message}</p>
                          
                          {log.details && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {log.details}
                            </p>
                          )}
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
