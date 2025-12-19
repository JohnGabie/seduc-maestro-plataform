import { useState } from "react";
import { CheckCircle, XCircle, Ban, Clock, FileText, TrendingUp, BarChart3, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { mockHistory, chartData, ExecutionHistory } from "@/data/mockLogs";

const statusConfig = {
  Sucesso: { icon: CheckCircle, color: "text-success", bg: "bg-success/10" },
  Falha: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
  Cancelado: { icon: Ban, color: "text-muted-foreground", bg: "bg-muted/10" },
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
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
    <div className="space-y-6 animate-fade-in">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <FileText className="h-4 w-4" />
            <span className="text-sm">Total</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center gap-2 text-success mb-1">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">Sucesso</span>
          </div>
          <p className="text-2xl font-bold text-success">{stats.sucesso}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center gap-2 text-destructive mb-1">
            <XCircle className="h-4 w-4" />
            <span className="text-sm">Falhas</span>
          </div>
          <p className="text-2xl font-bold text-destructive">{stats.falha}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center gap-2 text-primary mb-1">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">Taxa de Sucesso</span>
          </div>
          <p className="text-2xl font-bold text-primary">{taxaSucesso}%</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="bg-card rounded-lg border border-border p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Gráficos de Performance</h3>
        </div>

        <Tabs defaultValue="executions" className="space-y-4">
          <TabsList className="bg-muted/50 border border-border">
            <TabsTrigger value="executions" className="text-xs md:text-sm">Execuções</TabsTrigger>
            <TabsTrigger value="duration" className="text-xs md:text-sm">Duração</TabsTrigger>
            <TabsTrigger value="records" className="text-xs md:text-sm">Registros</TabsTrigger>
          </TabsList>

          <TabsContent value="executions" className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.executionTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ fontSize: '12px' }}
                  formatter={(value) => <span className="text-foreground">{value}</span>}
                />
                <Bar dataKey="sucesso" name="Sucesso" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="falha" name="Falha" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="duration" className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData.durationTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="durationGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  unit="min"
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="duracao"
                  name="Duração (min)"
                  stroke="hsl(var(--primary))"
                  fill="url(#durationGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="records" className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.recordsTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="registros"
                  name="Registros"
                  stroke="hsl(var(--info))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--info))', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: 'hsl(var(--info))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </div>

      {/* Timeline */}
      <div className="bg-card rounded-lg border border-border">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Histórico de Execuções</h3>
          </div>
          <Badge variant="secondary">{history.length} execuções</Badge>
        </div>
        <div className="divide-y divide-border">
          {history.map((exec, index) => {
            const config = statusConfig[exec.status];
            const Icon = config.icon;
            
            return (
              <div key={exec.id} className="p-4 hover:bg-muted/30 transition-colors">
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
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
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
                      <p className="text-sm text-destructive mt-1">
                        Erro: {exec.erro}
                      </p>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <Button variant="ghost" size="sm" className="text-muted-foreground hidden sm:flex">
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
