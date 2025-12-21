import { useState } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  XCircle,
  Filter,
  Check,
  Trash2,
  Bot
} from 'lucide-react';
import { AppSidebar, MobileMenuButton } from '@/components/AppSidebar';
import { AppBar } from '@/components/AppBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';
import { mockAlerts, Alert } from '@/data/mockAlerts';
import { useNavigate } from 'react-router-dom';

const alertTypeConfig = {
  erro: {
    icon: XCircle,
    bgColor: 'bg-destructive/10',
    textColor: 'text-destructive',
    borderColor: 'border-destructive/20',
    label: 'Erro'
  },
  aviso: {
    icon: AlertTriangle,
    bgColor: 'bg-warning/10',
    textColor: 'text-warning',
    borderColor: 'border-warning/20',
    label: 'Aviso'
  },
  sucesso: {
    icon: CheckCircle,
    bgColor: 'bg-success/10',
    textColor: 'text-success',
    borderColor: 'border-success/20',
    label: 'Sucesso'
  },
  info: {
    icon: Info,
    bgColor: 'bg-info/10',
    textColor: 'text-info',
    borderColor: 'border-info/20',
    label: 'Informação'
  }
};

export default function Alertas() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [filterType, setFilterType] = useState<string>('todos');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const navigate = useNavigate();

  const filteredAlerts = alerts.filter(alert => {
    if (filterType !== 'todos' && alert.tipo !== filterType) return false;
    if (filterStatus === 'nao-lidas' && alert.lida) return false;
    if (filterStatus === 'lidas' && !alert.lida) return false;
    return true;
  });

  const unreadCount = alerts.filter(a => !a.lida).length;
  const errorCount = alerts.filter(a => a.tipo === 'erro').length;
  const warningCount = alerts.filter(a => a.tipo === 'aviso').length;

  const markAsRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, lida: true } : a));
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, lida: true })));
  };

  const deleteAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Agora há pouco';
    if (diffHours < 24) return `Há ${diffHours}h`;
    if (diffDays === 1) return 'Ontem';
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <AppBar
          title="Alertas"
          leftContent={<MobileMenuButton onClick={() => setMobileOpen(true)} />}
        />
        
        <main className="flex-1 p-4 md:p-6 space-y-6 overflow-auto">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Bell className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{unreadCount}</p>
                    <p className="text-sm text-muted-foreground">Não lidas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-destructive/10">
                    <XCircle className="h-6 w-6 text-destructive" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{errorCount}</p>
                    <p className="text-sm text-muted-foreground">Erros</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-warning/10">
                    <AlertTriangle className="h-6 w-6 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{warningCount}</p>
                    <p className="text-sm text-muted-foreground">Avisos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters & Actions */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex items-center gap-3">
                  <Filter className="h-5 w-5 text-muted-foreground" />
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[150px] bg-background border-input">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os tipos</SelectItem>
                      <SelectItem value="erro">Erros</SelectItem>
                      <SelectItem value="aviso">Avisos</SelectItem>
                      <SelectItem value="sucesso">Sucesso</SelectItem>
                      <SelectItem value="info">Informação</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[150px] bg-background border-input">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todas</SelectItem>
                      <SelectItem value="nao-lidas">Não lidas</SelectItem>
                      <SelectItem value="lidas">Lidas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  variant="outline" 
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                  className="border-border"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Marcar todas como lidas
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Alert List */}
          <div className="space-y-3">
            {filteredAlerts.length === 0 ? (
              <Card className="bg-card border-border">
                <CardContent className="py-12 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhum alerta encontrado</p>
                </CardContent>
              </Card>
            ) : (
              filteredAlerts.map(alert => {
                const config = alertTypeConfig[alert.tipo];
                const Icon = config.icon;

                return (
                  <Card 
                    key={alert.id} 
                    className={cn(
                      'bg-card border transition-all hover:shadow-md',
                      !alert.lida && 'border-l-4',
                      !alert.lida && config.borderColor
                    )}
                  >
                    <CardContent className="py-4">
                      <div className="flex items-start gap-4">
                        <div className={cn('p-2 rounded-lg flex-shrink-0', config.bgColor)}>
                          <Icon className={cn('h-5 w-5', config.textColor)} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className={cn(
                                  'font-medium text-foreground',
                                  !alert.lida && 'font-semibold'
                                )}>
                                  {alert.titulo}
                                </h3>
                                {!alert.lida && (
                                  <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                                    Nova
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {alert.mensagem}
                              </p>
                              {alert.botNome && (
                                <button 
                                  onClick={() => navigate(`/bots/${alert.botId}`)}
                                  className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                                >
                                  <Bot className="h-3 w-3" />
                                  {alert.botNome}
                                </button>
                              )}
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-xs text-muted-foreground">
                                {formatDate(alert.dataHora)}
                              </span>
                              
                              {!alert.lida && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => markAsRead(alert.id)}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              )}
                              
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => deleteAlert(alert.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
